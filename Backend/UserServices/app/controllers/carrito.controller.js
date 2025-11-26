const Carrito = require('../models/carrito.model');
const Concierto = require('../models/concierto.model');
const Merchandising = require('../models/merchandising.model');
const User = require('../models/user.model');

// Función auxiliar para actualizar un carrito activo existente
async function updateActiveCarrito(userId, conciertos, merchandising) {
    try {
        const carrito = await Carrito.findOne({ userId: userId, is_active: true });
        if (!carrito) {
            throw new Error('No se encontró un carrito activo');
        }

        // Procesar conciertos (incrementales: positivos agregan, negativos restan)
        if (conciertos && conciertos.length > 0) {
            for (const item of conciertos) {
                const concierto = await Concierto.findOne({ slug: item.slug });
                if (!concierto) {
                    throw new Error(`Concierto no encontrado: ${item.slug}`);
                }

                // Buscar si el concierto ya existe en el carrito
                const existingIndex = carrito.conciertos.findIndex(
                    c => c.conciertoId.toString() === concierto._id.toString()
                );

                if (existingIndex !== -1) {
                    // Si existe, actualizar la cantidad (sumar o restar)
                    carrito.conciertos[existingIndex].cantidad += item.cantidad;
                    
                    // Si la cantidad es 0 o menor a 1 deberemos de eliminar el producto
                    if (carrito.conciertos[existingIndex].cantidad <= 0) {
                        carrito.conciertos.splice(existingIndex, 1);
                    }
                } else if (item.cantidad > 0) {
                    // Si no existe y la cantidad es positiva, agregarlo
                    carrito.conciertos.push({
                        conciertoId: concierto._id,
                        cantidad: item.cantidad
                    });
                }
            }
        }

        // Procesar merchandising (incrementales: positivos agregan, negativos restan)
        if (merchandising && merchandising.length > 0) {
            for (const item of merchandising) {
                const merch = await Merchandising.findById(item.merchandisingId);
                if (!merch) {
                    throw new Error(`Merchandising no encontrado: ${item.merchandisingId}`);
                }

                // Buscar si el merchandising ya existe en el carrito
                const existingIndex = carrito.merchandising.findIndex(
                    m => m.merchandisingId.toString() === item.merchandisingId.toString()
                );

                if (existingIndex !== -1) {
                    // Si existe, actualizar la cantidad (sumar o restar)
                    carrito.merchandising[existingIndex].cantidad += item.cantidad;
                    
                    // Si la cantidad es 0 o menor a 1 deberemos de eliminar el producto
                    if (carrito.merchandising[existingIndex].cantidad <= 0) {
                        carrito.merchandising.splice(existingIndex, 1);
                    }
                } else if (item.cantidad > 0) {
                    // Si no existe y la cantidad es positiva, agregarlo
                    carrito.merchandising.push({
                        merchandisingId: item.merchandisingId,
                        cantidad: item.cantidad
                    });
                }
            }
        }

        // Recalcular el precio total
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

// Función auxiliar para crear un nuevo carrito
async function createNewCarrito(userId, conciertos, merchandising) {
    try {
        let precioTotal = 0;
        const conciertosData = [];
        const merchandisingData = [];

        // Procesar conciertos
        if (conciertos && conciertos.length > 0) {
            for (const item of conciertos) {
                // Solo agregar si la cantidad es positiva
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

        // Procesar merchandising
        if (merchandising && merchandising.length > 0) {
            for (const item of merchandising) {
                // Solo agregar si la cantidad es positiva
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

async function carritoMaster(req, res){
    //Primero validamos que el usuario que este intentando acceder al carrito exista
    const { conciertos = [], merchandising = [] } = req.body;

    const userId = req.id;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    try {
        //Validamos si hay algun carrito con el id del user con estado is_active a true
        const carrito = await Carrito.findOne({ userId: userId, is_active: true });
        if (carrito) {
            //Si hay un carrito con el id del user con estado is_active a true entonces le deberemos de hacer un update
                //En el update para actualizar los productos que se agregaron al carrito deberemos de contemplarlos
                // desde el angular le pasaremos numeros negativos para eliminar y numeros positivos para agregar
                // Si la cantidad es 0 deberemos de eliminar el producto del carrito o cuando se resta es menor a 1 deberemos de eliminar el producto 
            // updateActiveCarrito(userId);  EJEMPLO DE USO
            const carritoActualizado = await updateActiveCarrito(userId, conciertos, merchandising);
            return res.status(200).json(carritoActualizado);
        }else if (!carrito && user){
            //Si vemos que no hay ninguno activo de un usuario que exista entonces deberemos de pasar a crearlo
            const nuevoCarrito = await createNewCarrito(userId, conciertos, merchandising);
            return res.status(201).json(nuevoCarrito);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

async function createCarrito(req, res) {

    console.log(req.id);
    console.log(req.body);
    try {
        const { conciertos = [], merchandising = [] } = req.body;
        const userId = req.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        let precioTotal = 0;
        const conciertosData = [];
        const merchandisingData = [];

        if (conciertos.length > 0) {
            for (const item of conciertos) {


                if (item.cantidad < 1) {
                    return res.status(400).json({ error: 'Cantidad debe ser mayor a 0' });
                }
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

                if (item.cantidad < 1) {
                    return res.status(400).json({ error: 'Cantidad debe ser mayor a 0' });
                }
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
            precio: precioTotal,
            status: "PENDING",
            is_active: true
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

        const carrito = await Carrito.findOne({ userId: req.id, is_active: true, status: 'PENDING' });
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
                if (item.cantidad < 1) {
                    return res.status(400).json({ error: 'Cantidad debe ser mayor a 0' });
                }
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
                if (item.cantidad < 1) {
                    return res.status(400).json({ error: 'Cantidad debe ser mayor a 0' });
                }
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
    try {
        console.log(req.id);
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
        
        //Encuentra todos los conciertos y merchandising y los mete en un array con todos los datos y la cantidad
        const conciertos = await Promise.all(carrito.conciertos.map(async (concierto) => {
            const conciertoData = await Concierto.findById(concierto.conciertoId);
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

        return res.status(200).json(data);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

async function updateStatus(req, res) {
    const STATUS = ['PENDING', 'ACCEPTED', 'REJECTED'];
    try {

        if (!STATUS.includes(req.body.status)) {
            return res.status(400).json({ error: 'Estado no válido' });
        }

        const carrito = await Carrito.findById(req.params.id);
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        carrito.status = req.body.status;
        const carritoActualizado = await carrito.save();
        return res.status(200).json(carritoActualizado);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

async function updateActive(req, res) {
    try {
        const carrito = await Carrito.findById(req.params.id);
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        carrito.is_active = req.body.is_active;
        const carritoActualizado = await carrito.save();
        return res.status(200).json(carritoActualizado);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    carritoMaster,
    createCarrito,
    getCarrito,
    updateCarrito,
    updateActive,
    updateStatus
};