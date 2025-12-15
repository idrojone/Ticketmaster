const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { json } = require('body-parser');
const { PassThrough } = require('stream');
const { type } = require('os');

const STATUS = ['ACCEPTED', 'PENDING', 'REJECTED'];


const userSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: STATUS,
        default: "ACCEPTED",
    },

    is_active: {
        type: Boolean,
        default: true,
    },

    role: {
        type: String,
        default: "USER",
    },

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "is invalid"],
        index: true,
    },

    password: {
        type: String,
        required: true,
    },

    bio: {
        type: String,
        default: "",
    },

    image: {
        type: String,
        default: "",
    },

    // Relación uno-a-uno con RefreshTokenStore (almacena un ObjectId)
    refreshTokenStore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RefreshTokenStore",
        unique: true,
        sparse: true,
    },

    // Relación muchos-a-muchos con BlackListToken
    BlackListToken: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BlackListToken",
        },
    ],

    // Relaciones de follow (slef-relation many-to-many)
    followedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    follows: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    // Relacion de Likes
    likedConciertos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Concierto",
        },
    ],

    // Entradas y Comentarios (relaciones one-to-many)

    entradas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Entrada",
        },
    ],

    comentarios: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comentario",
        },
    ],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },   
});

userSchema.plugin(uniqueValidator, { message: "Ya está en uso." });

userSchema.pre('save', function(next){
    // Generar public_id automáticamente si no existe
    if (!this.public_id) {
        this.public_id = crypto.randomUUID();
    }
    
    if (!this.image){
        this.image = 'https://static.productionready.io/images/smiley-cyrus.jpg';
    }
    next();
});

userSchema.plugin(uniqueValidator, {message: 'is already taken.'});

userSchema.methods.generateAccessToken = function() {
    const accessToken = jwt.sign(
        {
            id: this._id,
            public_id: this.public_id,
            email: this.email,
            username: this.username,
            role: "user"
        },
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    );
    return accessToken;
};

userSchema.methods.toUserResponse = async function(accessToken) {
    return {
        // _id: this._id,
        public_id: this.public_id,
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        likedConciertos: this.likedConciertos,
        followedBy: this.followedBy,
        follows: this.follows,
        accessToken: accessToken
    };
};

userSchema.methods.toUserDetails = async function() {
    // const favSlugs = await this.getFavouriteSlugs();
    // const followingUsernames = await this.getFollowingUsernames();

    return {
        _id: this._id,
        public_id: this.public_id,
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        likedConciertos: this.likedConciertos,
        followedBy: this.followedBy,
        follows: this.follows,
        // accessToken: accessToken
        // favouriteConciertos: favSlugs,
        // followingUsers: followingUsernames,
    };
};

userSchema.methods.UserComentarios = async function (_id) {
    const userId = _id;

    if (!mongoose.Types.ObjectId.isValid(String(userId))) return [];

    let Comentario = mongoose.model("Comentario");

    const comentarios = await Comentario.find({ autor: _id }).lean();

    return comentarios;
};

userSchema.methods.follow = async function(userId) {
    if (!this.followingUsers.includes(userId)) {
        this.followingUsers.push(userId);
        await this.save();
    }
};

userSchema.methods.unfollow = async function(userId) {
    this.followingUsers = this.followingUsers.filter(
        (followedId) => !followedId.equals(userId)
    );
    await this.save();
};

userSchema.methods.likeConcierto = async function(conciertoId) {  
    if (!this.favouriteConciertos.includes(conciertoId)) {
        this.favouriteConciertos.push(conciertoId);
        await this.save();
    }
};

userSchema.methods.unlikeConcierto = async function(conciertoId) {
    this.favouriteConciertos = this.favouriteConciertos.filter(
        (id) => !id.equals(conciertoId)
    );
    await this.save();
};

userSchema.methods.getFollowingUsernames = async function() {
    const followingIds = this.followingUsers
        .map((u) => {
            if (!u) return null;
            if (u._id) return u._id.toString();
            return u.toString();
        })
        .filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (!followingIds.length) return [];

    const User = mongoose.model('User');
    const users = await User.find({ _id: { $in: followingIds } })
        .select('username')
        .lean();

    const userMap = new Map(users.map((u) => [u._id.toString(), u.username]));

    return this.followingUsers.map((u) => {
        const id = u && u._id ? u._id.toString() : u ? u.toString() : null;
        return id && userMap.has(id) ? userMap.get(id) : null;
    }).filter(Boolean);
};

userSchema.methods.getFavouriteSlugs = async function() {
    const favIds = this.favouriteConciertos
        .map((c) => {
            if (!c) return null;
            if (c._id) return c._id.toString();
            return c.toString();
        })
        .filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (!favIds.length) return [];

    const Concierto = mongoose.model('Concierto');
    const conciertos = await Concierto.find({ _id: { $in: favIds } })
        .select('slug')
        .lean();

    const slugMap = new Map(conciertos.map((c) => [c._id.toString(), c.slug]));

    return this.favouriteConciertos.map((c) => {
        const id = c && c._id ? c._id.toString() : c ? c.toString() : null;
        return id && slugMap.has(id) ? slugMap.get(id) : null;
    }).filter(Boolean);
};
module.exports = mongoose.model('User', userSchema);