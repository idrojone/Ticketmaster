const mongoose = require('mongoose');

const VentaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    carritoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carritos',
        required: true,
    },
    conciertos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'conciertos',
    }],
    merchandising: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'merchandising',
    }],
    pagos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pagos',
    }],
    total: {
        type: Number,
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
        default: 'ACCEPTED',
    },
    is_active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // Handles createdAt and updatedAt automatically
    collection: 'ventas', // Corresponds to @@map("ventas")
});

module.exports = mongoose.model('Venta', VentaSchema);
