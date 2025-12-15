const mongoose = require('mongoose');

const STATUS = ['ACCEPTED', 'PENDING', 'REJECTED']; 
const userAdminSchema = new mongoose.Schema({
    status: { 
        type: String, 
        enum: STATUS, 
        default: 'ACCEPTED'
    },
    is_active: { 
        type: Boolean, 
        default: true 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    bio: { 
        type: String, 
        default: null },
    image: { 
        type: String, 
        default: null 
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    collection: 'user_admins',
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            return ret;
        }
    },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('UserAdmin', userAdminSchema);