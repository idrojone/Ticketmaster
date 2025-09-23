const Genero = require('../models/genero.model.js');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');


const create = asyncHandler(async (req, res) => {
    const genero_data = {
        nombre: req.body.nombre,
        img: req.body.img,
        descripcion: req.body.descripcion,
        id_genero: req.body.id_genero
    };

    if (!genero_data.nombre || !genero_data.img || !genero_data.descripcion || !genero_data.id_genero) {
        return res.status(400).json({
            message: "Todos los campos son obligatorios: nombre, img, descripcion, id_genero"
        });
    }

    const new_genero = new Genero(genero_data);
    await new_genero.save();

    res.status(201).json(new_genero.toGeneroResponse());
});

const findAllGeneros = asyncHandler(async (req, res) => {
    const generos = await Genero.find();

    if (!generos) {
        return res.status(401).json({
            message: "Genero not found"
        })
    }
    return res.status(200).json({
        generos: await Promise.all(generos.map(async generos => {
            return await generos.toGeneroResponse()
        }))
    }); 
});

const findOneGenero = asyncHandler(async (req, res) => {   
    const generos = await Genero.findOne(req.params);
    if (!generos) {
        return res.status(401).json({
            message: "Genero not found"
        })
    }
    return res.status(200).json({
        generos: await generos.toGeneroResponse()
    });
});

module.exports = { 
    create,
    findAllGeneros,
    findOneGenero
}