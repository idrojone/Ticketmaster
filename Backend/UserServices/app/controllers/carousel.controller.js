const Genero = require('../models/genero.model.js');
const Concierto = require('../models/concierto.model.js');
const asyncHandler = require('express-async-handler');

const findAllGenerosCarousel = asyncHandler(async (req, res) => {
    const generos = await Genero.find();

    if (!generos) {
        return res.status(401).json({
            message: "Genero not found"
        })
    }
    return res.status(200).json({
        generos: await Promise.all(generos.map(async generos => {
            return await generos.toGeneroCarouselResponse()
        }))
    });
});

module.exports = { 
    findAllGenerosCarousel
};
