const Concierto = require('../models/concierto.model.js');
const SpotifyAPI = require('../utils/SpotifyAPI.js');
const mongoose = require('mongoose');

async function findAllConciertos(req, res) {
    try {
        const conciertos = await Concierto.find();
        const spotifyAPI = new SpotifyAPI();
        // const conciertosWithImages = await Promise.all(conciertos.map(async (concierto) => {
        //     const artistImage = await spotifyAPI.getArtistImg(concierto.artista);
        //     return {
        //     ...concierto._doc,
        //     imagenArtista: artistImage ? artistImage.url : null
        //     };
        // }));
        res.json(conciertos);
    } catch (error) {
        res.status(500).json("Ha ocurrido un error", res.statusCode);
    }
}

async function findOneConcierto(req, res) {
    try {
        const slug = req.params.slug;
        const concierto =  await Concierto.findOne({ slug });

        if (!concierto) {
            return res.status(404).json({ message: 'Concierto no encontrado', status: 404 });
        } else {
            res.json(concierto);
        }
    } catch (error) {
        res.status(500).json("Ha ocurrido un error", res.statusCode);
    }
}

async function createConcierto(req, res) {
    try {
        const { nombre, fecha, artista, lugar, precio } = req.body;
        if (!nombre || !fecha || !artista || !lugar || !precio) {
            return res.status(400).json({ message: 'Faltan datos obligatorios', status: 400 });
        }

        const data = {
            nombre,
            fecha,
            artista,
            lugar,
            precio
        }

        const newConcierto = new Concierto(data);
        const newConciertoSaved = await newConcierto.save();
        res.json(newConciertoSaved);
    } catch (error) {
        res.status(500).json("Ha ocurrido un error", res.statusCode);
    }
}

async function updateConcierto(req, res) {
    try {
        const slug = req.params.slug;
        const { nombre, fecha, artista, lugar, precio } = req.body;


        // avisar quins datos falten
        const faltan = [];
        if (!nombre) faltan.push('nombre');
        if (!fecha) faltan.push('fecha');
        if (!artista) faltan.push('artista');
        if (!lugar) faltan.push('lugar');
        if (!precio) faltan.push('precio');

        if (faltan.length > 0) {
            return res.status(400).json({ 
                message: `Faltan datos obligatorios: ${faltan.join(', ')}`, 
                status: 400 
            });
        }

        const conciertoExistente = await Concierto.findOne({ slug });
        if (!conciertoExistente) {
            return res.status(404).json({ message: 'Concierto no encontrado', status: 404 });
        }

        const nombreCambio = conciertoExistente.nombre !== nombre;

        conciertoExistente.nombre = nombre;
        conciertoExistente.fecha = fecha;
        conciertoExistente.artista = artista;
        conciertoExistente.lugar = lugar;
        conciertoExistente.precio = precio;

        if (nombreCambio) {
            conciertoExistente.slug = undefined; // per a que canvie el slug
        }

        const conciertoUpdated = await conciertoExistente.save();
        res.json(conciertoUpdated);
    } catch (error) {
        res.status(500).json("Ha ocurrido un error", res.statusCode);
    }
}

async function deleteConcierto(req, res) {
    try {
        const slug = req.params.slug;
        const concierto = await Concierto.findOneAndDelete({ slug });

        if (!concierto) {
            return res.status(404).json({ message: 'Concierto no encontrado', status: 404 });
        } else {
            res.json({ message: 'Concierto eliminado correctamente', status: 200 });
        }

    } catch (error) {
        res.status(500).json("Ha ocurrido un error", res.statusCode);
    }
}

async function deleteAllConciertos(req, res) {
    try {
        await Concierto.deleteMany();
        res.json({ message: 'Todos los conciertos eliminados correctamente', status: 200 });
    } catch (error) {
        res.status(500).json("Ha ocurrido un error", res.statusCode);
    }
}


const concierto_controller = {
    findAllConciertos: findAllConciertos,
    findOneConcierto: findOneConcierto,
    createConcierto: createConcierto,
    updateConcierto: updateConcierto,
    deleteConcierto: deleteConcierto,
    deleteAllConciertos: deleteAllConciertos
}

module.exports = concierto_controller;


