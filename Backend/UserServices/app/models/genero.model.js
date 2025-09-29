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
        required: true
    },
    img: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    id_genero: {
        type: String,
        required: true
    },
    conciertos: [{type: mongoose.Schema.Types.ObjectId ,ref: "Concierto" }]
});

genero_schema.plugin(uniqueValidator, { msg: "already taken" });

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
        id_genero: this.id_genero
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

module.exports = mongoose.model('Genero', genero_schema);