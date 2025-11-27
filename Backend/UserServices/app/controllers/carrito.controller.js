const Carrito = require('../models/carrito.model');
const Concierto = require('../models/concierto.model');
const Merchandising = require('../models/merchandising.model');
const User = require('../models/user.model');

async function updateActiveCarrito(userId, conciertos, merchandising) {
    try {
        const carrito = await Carrito.findOne({ userId: userId, is_active: true });
        if (!carrito) {
            throw new Error('No se encontró un carrito activo');
        }

        if (conciertos && conciertos.length > 0) {
            for (const item of conciertos) {
                const concierto = await Concierto.findOne({ slug: item.slug });
                if (!concierto) {
                    throw new Error(`Concierto no encontrado: ${item.slug}`);
                }

                const existingIndex = carrito.conciertos.findIndex(
                    c => c.conciertoId.toString() === concierto._id.toString()
                );

                if (existingIndex !== -1) {
                    carrito.conciertos[existingIndex].cantidad += item.cantidad;

                    if (carrito.conciertos[existingIndex].cantidad <= 0) {
                        carrito.conciertos.splice(existingIndex, 1);
                    }
                } else if (item.cantidad > 0) {
                    carrito.conciertos.push({
                        conciertoId: concierto._id,
                        cantidad: item.cantidad
                    });
                }
            }
        }
        if (merchandising && merchandising.length > 0) {
            for (const item of merchandising) {
                const merch = await Merchandising.findById(item.merchandisingId);
                if (!merch) {
                    throw new Error(`Merchandising no encontrado: ${item.merchandisingId}`);
                }

                const existingIndex = carrito.merchandising.findIndex(
                    m => m.merchandisingId.toString() === item.merchandisingId.toString()
                );

                if (existingIndex !== -1) {
                    carrito.merchandising[existingIndex].cantidad += item.cantidad;

                    if (carrito.merchandising[existingIndex].cantidad <= 0) {
                        carrito.merchandising.splice(existingIndex, 1);
                    }
                } else if (item.cantidad > 0) {
                    carrito.merchandising.push({
                        merchandisingId: item.merchandisingId,
                        cantidad: item.cantidad
                    });
                }
            }
        }


        let precioTotal = 0;

        for (const item of carrito.conciertos) {
            const concierto = await Concierto.findById(item.conciertoId);
            if (concierto) {
                precioTotal += concierto.precio * item.cantidad;
            }
        }

        for (const item of carrito.merchandising) {
            const merch = await Merchandising.findById(item.merchandisingId);
            if (merch) {
                precioTotal += merch.precio * item.cantidad;
            }
        }

        carrito.precio = precioTotal;
        await carrito.save();

        return carrito;
    } catch (error) {
        throw error;
    }
}

async function createNewCarrito(userId, conciertos, merchandising) {
    try {
        let precioTotal = 0;
        const conciertosData = [];
        const merchandisingData = [];

        if (conciertos && conciertos.length > 0) {
            for (const item of conciertos) {
                if (item.cantidad > 0) {
                    const concierto = await Concierto.findOne({ slug: item.slug });
                    if (!concierto) {
                        throw new Error(`Concierto no encontrado: ${item.slug}`);
                    }
                    precioTotal += concierto.precio * item.cantidad;
                    conciertosData.push({
                        conciertoId: concierto._id,
                        cantidad: item.cantidad
                    });
                }
            }
        }

        if (merchandising && merchandising.length > 0) {
            for (const item of merchandising) {
                if (item.cantidad > 0) {
                    const merch = await Merchandising.findById(item.merchandisingId);
                    if (!merch) {
                        throw new Error(`Merchandising no encontrado: ${item.merchandisingId}`);
                    }
                    precioTotal += merch.precio * item.cantidad;
                    merchandisingData.push({
                        merchandisingId: item.merchandisingId,
                        cantidad: item.cantidad
                    });
                }
            }
        }

        const carrito = await Carrito.create({
            userId,
            conciertos: conciertosData,
            merchandising: merchandisingData,
            precio: precioTotal,
            status: "PENDING",
            is_active: true
        });

        return carrito;
    } catch (error) {
        throw error;
    }
}

async function carritoMaster(req, res) {
    const { conciertos = [], merchandising = [] } = req.body;

    const userId = req.id;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    try {
        const carrito = await Carrito.findOne({ userId: userId, is_active: true });
        if (carrito) {
            const carritoActualizado = await updateActiveCarrito(userId, conciertos, merchandising);
            return res.status(200).json(carritoActualizado);
        } else if (!carrito && user) {
            const nuevoCarrito = await createNewCarrito(userId, conciertos, merchandising);
            return res.status(201).json(nuevoCarrito);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

async function getCarrito(req, res) {
    try {
        const user = await User.findById(req.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const carrito = await Carrito.findOne({ userId: req.id, is_active: true, status: 'PENDING' });
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado o inactivo' });
        }

        const data = {
            carrito,
            conciertos: [],
            merchandising: []
        }

        const conciertos = await Promise.all(carrito.conciertos.map(async (concierto) => {
            const conciertoData = await Concierto.findById(concierto.conciertoId).select('slug nombre fecha precio imagenArtista');
            return {
                ...conciertoData._doc,
                cantidad: concierto.cantidad
            };
        }));

        const merchandising = await Promise.all(carrito.merchandising.map(async (merch) => {
            const merchData = await Merchandising.findById(merch.merchandisingId);
            return {
                ...merchData._doc,
                cantidad: merch.cantidad
            };
        }));

        data.conciertos = conciertos;
        data.merchandising = merchandising;

        console.log(data);
        return res.status(200).json(data);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

async function updateStatus(req, res) {
    const user = await User.findById(req.id);
    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const carrito = await Carrito.findOne({ userId: req.id, is_active: true, status: 'PENDING' });
    if (!carrito) {
        return res.status(404).json({ error: 'Carrito no encontrado o inactivo' });
    }
    carrito.status = req.body.status;
    try {
        const carritoActualizado = await carrito.save();
        return res.status(200).json(carritoActualizado);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}

async function updateActive(req, res) {

}

module.exports = {
    carritoMaster,
    getCarrito,
    updateActive,
    updateStatus
};