const Concierto = require('../models/concierto.model.js');
const SpotifyAPI = require('../utils/SpotifyAPI.js');
const mongoose = require('mongoose');

const genero=require('../models/genero.model.js');

async function findAllConciertos(req, res) {
    try {
        const conciertos = await Concierto.find();
        const spotifyAPI = new SpotifyAPI();

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
        const { nombre, fecha, artista, lugar, precio, id_genero } = req.body;
        if (!nombre || !fecha || !artista || !lugar || !precio || !id_genero) {
            return res.status(400).json({ message: 'Faltan datos obligatorios', status: 400 });
        }

        const data = {
            nombre,
            fecha,
            artista,
            lugar,
            precio,
            id_genero
        }

        const find_genero= await genero.findById(id_genero);

        if(!find_genero){
            return res.status(404).json({ message: 'Genero no encontrado', status: 404 });
        }

        const newConcierto = await new Concierto(data);
        const newConciertoSaved = await newConcierto.save();

        await find_genero.addConcierto(newConciertoSaved._id);

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
        } 

        const GeneroTarget = await genero.findById(concierto.id_genero);

        try {
            await GeneroTarget.removeConcierto(concierto._id);
            // console.log(concierto._id.toString());
            return res.json({ message: 'Concierto eliminado correctamente', status: 200 });
        } catch (error) {
            return res.status(500).json({ message: 'Error al eliminar concierto de el género', status: 500 });
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

async function findConciertosByGenero(req, res) {
    try {
        const slug = req.params.slug;

        const generoFound = await genero.findOne({slug}).exec();

        if (!generoFound) {
            return res.status(404).json({ message: "Genero no encontrado", status: 404 });
        }

        return await res.status(200).json({
            conciertos: await Promise.all(generoFound.conciertos.map(async conciertoId => {
                const concierto=await Concierto.findById(conciertoId);
                return concierto;
            }))
        });

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
    deleteAllConciertos: deleteAllConciertos,
    findConciertosByGenero: findConciertosByGenero,
};

module.exports = concierto_controller;