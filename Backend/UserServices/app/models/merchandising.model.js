const mongoose = require('mongoose');

const MerchandisingSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    imagen: {
        type: String,
        trim: true
    },
    conciertoIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Concierto'
    }],
    categoriaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoriaMerchandising', // Reference to the CategoriaMerchandising model
        required: true
    },
    ventas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venta' // Reference to the Venta model
    }],
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'], // Assuming these are the possible values for Status enum
        default: 'ACCEPTED'
    },
    is_active: {
        type: Boolean,
        default: true
    },
    carritos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carrito' // Reference to the Carrito model
    }]
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
    collection: 'merchandising' // Specifies the collection name
});

const Merchandising = mongoose.model('Merchandising', MerchandisingSchema);

module.exports = Merchandising;
