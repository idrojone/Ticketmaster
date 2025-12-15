const Entrada = require('../models/entradas.model');
const User = require('../models/user.model');
const Concierto = require('../models/concierto.model');

async function getEntradas(req, res) {
    try {
        const entrada = await Entrada.find({ userId: req.id }).select("conciertoId tipo cantidad precio fecha_compra");
        if (!entrada) {
            return res.status(404).json({ message: "Entradas no encontradas" });
        }

        const concierto = await Concierto.findOne({ _id: entrada.conciertoId }).select("nombre fecha lugar");
        if (concierto) {
            entrada.concierto = concierto;
        }

        const entradasConConciertos = await Promise.all(
            entrada.map(async (ent) => {
            const concierto = await Concierto.findOne({ _id: ent.conciertoId }).select("nombre fecha lugar");
            return { ...ent.toObject(), concierto };
            })
        );
        return res.status(200).json({ entrada: entradasConConciertos });
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener las entradas", error: error.message });
    }
}


module.exports = {
    getEntradas
}