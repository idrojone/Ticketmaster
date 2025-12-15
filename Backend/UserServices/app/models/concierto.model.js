const mongoose = require('mongoose');
const slugify = require('slugify');
const uniqueValidator = require('mongoose-unique-validator');
const User = require('./user.model.js');

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
        type: Date, 
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
    // relación con Genero: guardamos ref al documento Genero (ObjectId)
    genero: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genero',
        required: false,
        default: null
    },
    // campo legacy/id externo si lo necesitas (opcional)
    id_genero: {
        type: String,
        required: false,
        default: null
    },
    likes: {
        type: Number,
        default: 0
    },
    // usuarios que han dado like (many-to-many)
    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    // entradas relacionadas
    entradas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Entrada'
        }
    ],
    
    status: {
        type: String,
        enum: ['ACCEPTED', 'PENDING', 'REJECTED'],
        default: 'ACCEPTED'
    },
    is_active: {
        type: Boolean,
        default: true
    },
    comentarios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comentario'
    }],
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
        genero: this.genero, // puede estar poblado o ser ObjectId
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

ConciertoSchema.methods.borrarComentario = async function(comentarioId) {  
    this.comentarios = this.comentarios.filter(id => id.toString() !== comentarioId.toString());
    await this.save();
}

ConciertoSchema.methods.updateLikes = async function() {  
    const likeCount = await User.countDocuments({
        favouriteConciertos: this._id
    });
    this.likes = likeCount;
    await this.save();
    return likeCount;
}


module.exports = mongoose.model('Concierto', ConciertoSchema);

// Transformación JSON: mapear _id -> id y ocultar __v
ConciertoSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});
