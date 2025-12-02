const Entrada = require('../models/entradas.model');
const User = require('../models/user.model');

async function getEntradas(req, res) {
    try {
        const entrada = await Entrada.find({ userId: req.id }).select("conciertoId tipo cantidad precio fecha_compra");
        return res.status(200).json({ entrada });
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener las entradas", error: error.message });
    }
}


module.exports = {
    getEntradas
}