const { default: mongoose } = require('mongoose');

const blackListTokenSchema = new mongoose.Schema({
    // referencia al usuario
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    token: {
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
    collection: 'blacklist_tokens'
});

// Transformación JSON: mapear _id -> id y ocultar __v
blackListTokenSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

const BlackListToken = mongoose.model('BlackListToken', blackListTokenSchema);
module.exports = BlackListToken;