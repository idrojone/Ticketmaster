const { default: mongoose } = require('mongoose');

const refreshTokenStore = new mongoose.Schema({
    // referencia al usuario (userId) - one-to-one
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        sparse: true
    },
    refreshToken: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['ACCEPTED', 'PENDING', 'REJECTED'],
        default: 'ACCEPTED'
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'refresh_token_stores'
});

// Transformación JSON: mapear _id -> id y ocultar __v
refreshTokenStore.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenStore);
module.exports = RefreshToken;