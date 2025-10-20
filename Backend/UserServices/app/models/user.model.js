const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Concierto = require('./concierto.model');

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

userSchema.methods.toUserResponse = async function() {
    console.log('User Model - toUserResponse called');
  
    const favSlugs = await Promise.all(
        (this.favouriteConciertos || []).map(async (concierto) => {
            try {
                const c = await Concierto.findById(concierto).select('slug').lean();
                return c ? c.slug : null;
            } catch (err) {
                return null;
            }
        })
    );

    console.log('Slug Concierto', favSlugs);

    return {
        _id: this._id,
        public_id: this.public_id,
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        favouriteConciertos: favSlugs.filter(Boolean),
        followingUsers: this.followingUsers,
        token: this.generateAccessToken()
    }
};

userSchema.methods.toUserDetails = async function() {

    console.log("User Model - toUserDetails called");

    const favSlugs = await Promise.all(
        this.favouriteConciertos.map( async (concierto) => {
            try {
                console.log("Fetching slug for concierto ID:", concierto);
                const c = await Concierto.findById(concierto).select('slug').lean();
                return c ? c.slug : null;
            } catch (err) {
                return null;
            }   
        })
    );

    console.log("Slug Concierto", favSlugs);

    return {
        _id: this._id,
        public_id: this.public_id,
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        favouriteConciertos: favSlugs.filter(Boolean),
        followingUsers: this.followingUsers
    }
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

module.exports = mongoose.model('User', userSchema);