const mongoose = require('mongoose');
const User = require('./user.model.js');

const ComentarioSchema = new mongoose.Schema({
    contenido: {
        type: String,
        required: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    conciertoSlug: {
        type: String,
        required: true
    },
},  { timestamps: true });

ComentarioSchema.methods.toComentarioResponse = async function() {
    console.log("Generating comentario response for:", this);
    console.log("Autor ID:", this.autor);
    console.log("Contenido:", this.contenido);
    console.log("Comentario ID:", this._id);
    const autor = await User.findById(this.autor).exec();
    return {
        id: this._id,
        contenido: this.contenido,
        autor: autor.toUserDetails(),
    }
};

module.exports = mongoose.model('Comentario', ComentarioSchema);