const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        conciertos: [{
            conciertoId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Concierto'
            },
            cantidad: {
                type: Number,
                default: 1
            }
        }],
        merchandising: [{
            merchandisingId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Merchandising'
            },
            cantidad: {
                type: Number,
                default: 1
            }
        }],
        precio: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['ACCEPTED', 'PENDING', 'REJECTED', 'CANCELLED'],
            default: 'ACCEPTED'
        },
        is_active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        collection: 'carritos'
    }
);

const Carrito = mongoose.model('Carrito', carritoSchema);

module.exports = Carrito;
