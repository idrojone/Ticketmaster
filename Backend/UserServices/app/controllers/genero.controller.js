const Genero = require('../models/genero.model.js');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const conciertos = require("../controllers/concierto.controller.js");

const create = asyncHandler(async (req, res) => {

    const { nombre, img , descripcion, id_genero } = req.body;

    const camposrRequeridos = { nombre, img , descripcion, id_genero };
    const camposFaltantes = Object.keys(camposrRequeridos).filter(key => !camposrRequeridos[key]);

    if (camposFaltantes.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Faltan los siguientes campos obligatorios: ${camposFaltantes.join(', ')}`,
            status: 400
        });
    }

    if(typeof precio === 'string' && precio.trim().length === 0) { 
        return res.status(400).json({
            success: false,
            message: "El campo precio no puede estar vacío",
            status: 400
        });
    }

    const exsisteGenero = await Genero.findOne({ id_genero });
    if (exsisteGenero) {
        return res.status(409).json({
            success: false,
            message: "El id_genero ya existe",
            status: 409
        });
    }
    const genero_data = { nombre, img , descripcion, id_genero };

    const new_genero = new Genero(genero_data);
    await new_genero.save();

    res.status(201).json({
        success: true,
        message: "Genero creado correctamente",
        genero: new_genero.toGeneroResponse(),
        status: 201
    });
});

const findAllGeneros = asyncHandler(async (req, res) => {
    const generos = await Genero.find();

    if (generos.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No se encontraron géneros",
            status: 404
        });
    }

    const generosFormatted = generos.map(genero => genero.toGeneroResponse());

    return res.status(200).json({
        success: true,
        message: "Géneros obtenidos correctamente",
        data: generosFormatted,
        count: generos.length,
        status: 200
    }); 
});

const findOneGenero = asyncHandler(async (req, res) => { 
    
    const { slug } = req.params;
    const generos = await Genero.findOne({ slug });

    // return res.json(generos);

    if (!generos) {
        return res.status(404).json({
            success: false,
            message: "Genero not found",
            status: 404
        });
    }
    return res.json(generos);
});

const findOneGeneroById = asyncHandler(async (req, res) => {
    const { id_genero } = req.params;
    const genero = await Genero.findOne({ id_genero });
    if (!genero) {
        return res.status(404).json({
            success: false,
            message: "Genero not found",
            status: 404
        });
    }
    return res.status(200).json({
        success: true,
        message: "Género obtenido correctamente",
        data: genero.toGeneroResponse(),
        status: 200
    });
});

module.exports = { 
    create,
    findAllGeneros,
    findOneGenero,
    findOneGeneroById
}