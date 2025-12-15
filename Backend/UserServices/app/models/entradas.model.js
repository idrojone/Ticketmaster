const mongoose = require('mongoose');

const entradaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conciertoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Concierto',
    required: true
  },
  tipo: {
    type: String,
    default: "GENERAL"
  },
  cantidad: {
    type: Number,
    default: 1
  },
  precio_compra: {
    type: Number,
    required: true
  },
  fecha_compra: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['ACCEPTED', 'PENDING', 'REJECTED'],
    default: "ACCEPTED"
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Entradas', entradaSchema);
