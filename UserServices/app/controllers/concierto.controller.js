const Concierto = require('../models/concierto.model.js');
const mongoose = require('mongoose');


const findAllConciertos = (req, res) => {
    Concierto.find()
        .then(conciertos => {
            res.status(200).json(conciertos);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error al obtener los conciertos', error: err });
        });
};

module.exports = {
    findAllConciertos
};