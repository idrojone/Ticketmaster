const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        carritoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Carrito',
            required: true,
        },
        conciertos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CarritoConcierto',
            },
        ],
        merchandising: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CarritoMerchandising',
            },
        ],
        payments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Payment',
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
            default: 'PENDING',
        },
    },
    {
        timestamps: true,
        collection: 'orders',
    }
);

module.exports = mongoose.model('Order', orderSchema);