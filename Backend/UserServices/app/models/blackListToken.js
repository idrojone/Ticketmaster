const { default: mongoose } = require("mongoose");

const blackListTokenSchema = new mongoose.Schema({

    id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
    }
});

const BlackListToken = mongoose.model('BlackListToken', blackListTokenSchema);
module.exports = BlackListToken;