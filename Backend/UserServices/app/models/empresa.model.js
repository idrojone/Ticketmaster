const mongoose = require('mongoose');

const { Schema } = mongoose;

const STATUS = ['ACCEPTED', 'PENDING', 'REJECTED']; // adjust enum values as needed

const EmpresaSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId(),
        },
        status: {
            type: String,
            enum: STATUS,
            default: 'ACCEPTED',
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
            default: null,
        },
        image: {
            type: String,
            default: null,
        },
    },
    {
        collection: 'user_empresas',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
        toObject: { virtuals: true },
    }
);

module.exports = mongoose.model('UserEmpresa', EmpresaSchema);