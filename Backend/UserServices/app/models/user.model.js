const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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

userSchema.methods.toUserResponse = function() {
    return {
        public_id: this.public_id,
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        token: this.generateAccessToken()
    }
};

userSchema.methods.toUserDetails = function() {
    return {
        public_id: this.public_id,
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image
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

module.exports = mongoose.model('User', userSchema);