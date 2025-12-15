const mongoose = require('mongoose');
const User = require('./user.model.js');

const ComentarioSchema = new mongoose.Schema({
    contenido: {
        type: String,
        required: true
    },
    // referencia al usuario que escribe el comentario
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // mantener 'autor' por compatibilidad con código existente
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // referencia al concierto (ObjectId)
    concierto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Concierto',
        required: false,
        default: null
    },
    // campo legacy: slug del concierto (mantener por compatibilidad)
    conciertoSlug: {
        type: String,
        required: false,
        default: null
    },
    status: {
        type: String,
        enum: ['ACCEPTED','PENDING','REJECTED'],
        default: 'ACCEPTED'
    },
    is_active: {
        type: Boolean,
        default: true
    }
},  { timestamps: true });

ComentarioSchema.methods.toComentarioResponse = async function() {
    // Soportamos tanto `user` como `autor` para compatibilidad.
    const userId = this.user || this.autor;
    const autorDoc = userId ? await User.findById(userId).exec() : null;

    return {
        id: this._id,
        contenido: this.contenido,
        autor: autorDoc ? await autorDoc.toUserDetails() : null,
        concierto: this.concierto || this.conciertoSlug || null,
        status: this.status,
        is_active: this.is_active,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    }
};

// Transformación JSON: mapear _id -> id y ocultar __v
ComentarioSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Comentario', ComentarioSchema);