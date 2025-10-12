const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const { use } = require('react');

const userSchema = new mongoose.Schema({

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
            email: this.email,
            username: this.username,
            password: this.password
        },
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    );
    return accessToken;
};

userSchema.methods.toUserResponse = function() {
    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        token: this.generateAccessToken()
    }
};

userSchema.methods.toUserDetails = function() {
    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image
    }
};

module.exports = mongoose.model('User', userSchema);