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
    precio: { 
        type: Number, 
        required: true 
    }
});

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

module.exports = mongoose.model('Concierto', ConciertoSchema);