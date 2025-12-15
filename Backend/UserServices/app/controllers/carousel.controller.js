const Genero = require('../models/genero.model.js');
const Concierto = require('../models/concierto.model.js');
const asyncHandler = require('express-async-handler');
const SpotifyAPI = require('../utils/SpotifyAPI.js');

const findAllGenerosCarousel = asyncHandler(async (req, res) => {
    const generos = await Genero.find(
        { is_active: true, status: 'ACCEPTED' }
    );

    if (!generos) {
        return res.status(404).json({
            message: "Genero no encontrado",
            status: 404
        })
    }
    return res.status(200).json({
        generos: await Promise.all(generos.map(async generos => {
            return await generos;
            
        }))
    });
});

const getAllConciertosCarrusel = asyncHandler(async (req, res) => {
    const conciertos = await Concierto.find()
    if (!conciertos || conciertos.length === 0) {
        return res.status(404).json({
            message: "Conciertos no encontrados",
            status: 404
        });
    }

    return res.status(200).json({
        conciertos: await Promise.all(
            conciertos.map(
                async concierto => {
                    return await concierto.toConciertoCarouselResponse()
                }
            )
        )
    });
});

const getOneConciertoCarrusel = asyncHandler(async (req, res) => {
    const concierto = await Concierto.findOne({ slug: req.params.slug });
    if (!concierto) {
        return res.status(404).json({
            message: "Concierto no encontrado",
            status: 404
        });
    }
    return res.status(200).json({
        concierto: await concierto.toConciertoDetailsResponse()
    });
});

module.exports = { 
    findAllGenerosCarousel,
    getAllConciertosCarrusel,
    getOneConciertoCarrusel
};
