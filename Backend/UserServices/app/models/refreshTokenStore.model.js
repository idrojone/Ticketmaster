const { default: mongoose } = require("mongoose");

const refreshTokenStore = new mongoose.Schema({

    id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    }
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenStore);
module.exports = RefreshToken;