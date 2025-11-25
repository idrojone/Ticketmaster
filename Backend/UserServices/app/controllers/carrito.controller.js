const Carrito = require('../models/carrito.model');
const Concierto = require('../models/concierto.model');
const Merchandising = require('../models/merchandising.model');

async function createCarrito(req, res) {
    console.log(req.id);
    console.log(req.body);
    try {
        const { conciertos = [], merchandising = [] } = req.body;
        const userId = req.id;

        let precioTotal = 0;
        const conciertosData = [];
        const merchandisingData = [];

        if (conciertos.length > 0) {
            for (const item of conciertos) {
                const concierto = await Concierto.findOne({ slug: item.slug });
                if (!concierto) {
                    return res.status(404).json({ error: `Concierto no encontrado: ${item.slug}` });
                }
                precioTotal += concierto.precio * item.cantidad;
                conciertosData.push({
                    conciertoId: concierto._id,
                    cantidad: item.cantidad
                });
            }
        }

        if (merchandising.length > 0) {
            for (const item of merchandising) {
                const merch = await Merchandising.findById(item.merchandisingId);
                if (!merch) {
                    return res.status(404).json({ error: `Merchandising no encontrado: ${item.merchandisingId}` });
                }
                precioTotal += merch.precio * item.cantidad;
                merchandisingData.push({
                    merchandisingId: item.merchandisingId,
                    cantidad: item.cantidad
                });
            }
        }

        const carrito = await Carrito.create({
            userId,
            conciertos: conciertosData,
            merchandising: merchandisingData,
            precio: precioTotal
        });

        return res.status(201).json(carrito);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

async function updateCarrito(req, res) {
    console.log(req.id);
    try {
        const { conciertos = [], merchandising = [] } = req.body;

        const carrito = await Carrito.findById(req.params.id);
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        if (carrito.userId.toString() !== req.id) {
            return res.status(403).json({ error: 'No tienes permiso para editar este carrito' });
        }

        let precioTotal = 0;
        const conciertosData = [];
        const merchandisingData = [];

        if (conciertos.length > 0) {
            for (const item of conciertos) {
                const concierto = await Concierto.findOne({ slug: item.slug });
                if (!concierto) {
                    return res.status(404).json({ error: `Concierto no encontrado: ${item.slug}` });
                }
                precioTotal += concierto.precio * item.cantidad;
                conciertosData.push({
                    conciertoId: concierto._id,
                    cantidad: item.cantidad
                });
            }
        }

        if (merchandising.length > 0) {
            for (const item of merchandising) {
                const merch = await Merchandising.findById(item.merchandisingId);
                if (!merch) {
                    return res.status(404).json({ error: `Merchandising no encontrado: ${item.merchandisingId}` });
                }
                precioTotal += merch.precio * item.cantidad;
                merchandisingData.push({
                    merchandisingId: item.merchandisingId,
                    cantidad: item.cantidad
                });
            }
        }

        carrito.conciertos = conciertosData;
        carrito.merchandising = merchandisingData;
        carrito.precio = precioTotal;

        const carritoActualizado = await carrito.save();

        return res.status(200).json(carritoActualizado);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

async function getCarrito(req, res) {
    console.log(req.id);
    try {
        const carrito = await Carrito.findById(req.params.id);
        return res.status(200).json(carrito);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createCarrito,
    getCarrito,
    updateCarrito
};