const mongoose = require('mongoose');
const slugify = require('slugify');
const uniqueValidator = require('mongoose-unique-validator');

const ConciertoSchema = new mongoose.Schema({
    slug: { 
        type: String, 
        lowercase: true, 
        unique: true 
    },
    nombre: { 
        type: String, 
        required: true 
    },
    fecha: { 
        type: String, 
        required: true 
    },
    artista: { 
        type: String, 
        required: true 
    },
    lugar: { 
        type: String, 
        required: true 
    },
    ciudad: { 
        type: String, 
        required: true 
    },
    descripcion: { 
        type: String, 
        default: null
    },
    latitud: { 
        type: Number,
        default: null
    },
    longitud: { 
        type: Number,
        default: null
    },
    precio: { 
        type: Number, 
        required: true 
    },
    aforo: {
        type: Number,
        required:true
    },
    duracion: { 
        type: Number,
        default: null
    },
    imagenArtista: { 
        type: String, 
        default: null
    },
    imagenesShow: { 
        type: [String], 
        default: [] 
    },
    id_genero: {
        type: String,
        // required: true
    },
    comentarios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comentario'
    }]
}, { timestamps: true });

ConciertoSchema.plugin(uniqueValidator, { message: 'ya esta en uso' });

ConciertoSchema.pre('validate', async function(next) {
    if (!this.slug) {
        await this.slugify();
    }
    next();
});

ConciertoSchema.methods.slugify = async function() {
    this.slug = slugify(this.nombre) + '-' + (Math.random() * Math.pow(36, 10) | 0).toString(36);
};

ConciertoSchema.methods.toConciertoResponse = async function () {
    return {
        slug: this.slug,
        nombre: this.nombre,
        fecha: this.fecha,
        artista: this.artista,
        lugar: this.lugar,
        ciudad: this.ciudad,
        precio: this.precio,
        aforo: this.aforo,
        duracion: this.duracion,
        imagenArtista: this.imagenArtista,
        id_genero: this.id_genero,
        descripcion: this.descripcion,
        latitud: this.latitud,
        longitud: this.longitud,
        imagenesShow: this.imagenesShow
    }
};

ConciertoSchema.methods.toConciertoCarouselResponse = async function () {
    return {
        slug: this.slug,
        nombre: this.nombre,
        imagenArtista: this.imagenArtista,
    }
};

ConciertoSchema.methods.toConciertoDetailsResponse = async function () {
    return {
        slug: this.slug,
        imagenesShow: this.imagenesShow
    }
};

ConciertoSchema.methods.anadirComentario = async function(comentarioId) {  
    // Mirar como mejorarlo
    this.comentarios.push(comentarioId);
    await this.save();
}

module.exports = mongoose.model('Concierto', ConciertoSchema);
