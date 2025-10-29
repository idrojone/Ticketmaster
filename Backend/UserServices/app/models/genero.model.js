const mongoose = require('mongoose');
const slug = require('slugify');
const uniqueValidator = require('mongoose-unique-validator');

const genero_schema = mongoose.Schema({
    slug: {
        type: String,
        lowercase: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    img: {
        type: String,
        required: false,
        default: null
    },
    descripcion: {
        type: String,
        required: false,
        default: null
    },
    id_genero: {
        type: String,
        required: true,
        unique: true
    },
    conciertos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Concierto' }],
    status: {
        type: String,
        enum: ['ACCEPTED', 'PENDING', 'REJECTED'],
        default: 'ACCEPTED'
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

genero_schema.plugin(uniqueValidator, { msg: 'already taken' });

genero_schema.pre('validate', function (next) {
    if (!this.slug) {
       this.slugify();
    }
    next();
});

genero_schema.methods.slugify = function () {
    if (this.nombre && typeof this.nombre === 'string') {
        this.slug = slug(this.nombre) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
    }
};

genero_schema.methods.toGeneroResponse = function() {
    return {
        slug: this.slug,
        nombre: this.nombre,
        img: this.img,
        descripcion: this.descripcion,
        id_genero: this.id_genero,
        status: this.status,
        is_active: this.is_active,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    };
}

genero_schema.methods.toGeneroCarouselResponse = function() {
    return {
        slug: this.slug,
        nombre: this.nombre,
        img: this.img
    };
}

genero_schema.methods.addConcierto = function(concierto_id) {

    if (this.conciertos.indexOf(concierto_id) === -1) {
        this.conciertos.push(concierto_id);
    }

    return this.save();

}

genero_schema.methods.removeConcierto = function(concierto_id) {

    if (this.conciertos.indexOf(concierto_id) !== -1) {
        this.conciertos.pull(concierto_id);
    }
    return this.save();
}

genero_schema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model("Genero", genero_schema);