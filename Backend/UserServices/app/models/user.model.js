const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { json } = require('body-parser');

const userSchema = new mongoose.Schema({
    public_id: {
        type: String,
        unique: true,
    },
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
    },email:{
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    bio: {
        type: String,
        default: ''
    },
    image: {
        type:String,
        default:''
    },
    favouriteConciertos:[
        {
            type: mongoose.Schema.Types.ObjectId,
            // type: String,
            ref: 'Concierto'
        }
    ],
    followingUsers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
},{timestamps:true});

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
            username: this.username
        },
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    );
    return accessToken;
};

userSchema.methods.toUserResponse = async function(accessToken) {
    console.log('User Model - toUserResponse called');
    const favSlugs = await this.getFavouriteSlugs();

    const followingUsernames = await this.getFollowingUsernames();


    return {
        _id: this._id,
        public_id: this.public_id,
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        favouriteConciertos: favSlugs,
        followingUsers: followingUsernames,
        accessToken: accessToken
        // accessToken: this.generateAccessToken(),
    };
};

userSchema.methods.toUserDetails = async function() {
    const favSlugs = await this.getFavouriteSlugs();
    const followingUsernames = await this.getFollowingUsernames();

    return {
        _id: this._id,
        public_id: this.public_id,
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        favouriteConciertos: favSlugs,
        followingUsers: followingUsernames,
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