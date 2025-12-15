const mongoose = require('mongoose');

const PagosSchema = new mongoose.Schema({
    ventaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ventas',
        required: true,
    },
    metodo: {
        type: String,
        required: true,
    },
    monto: {
        type: Number,
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'],
        default: 'ACCEPTED',
    },
    is_active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // Handles createdAt and updatedAt automatically
    collection: 'pagos' // Maps to @@map("pagos")
});

const Pagos = mongoose.model('Pagos', PagosSchema);

module.exports = Pagos;
