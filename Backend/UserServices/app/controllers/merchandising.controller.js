const Merchandising = require('../models/merchandising.model');
const Carrito = require('../models/carrito.model');
const User = require('../models/user.model');

async function getMerchandising(req, res) {
    try {
        const { id } = req.params;
        console.log(id);
        const merchandising = await Merchandising.findById(id);
        // const merchandising = await Merchandising.findOne({ slug: id });
        if (!merchandising) {
            return res.status(404).json({ message: 'Merchandising no encontrado.' });
        }
        res.json(merchandising);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getMerchandisingCarrito(req, res) {
    // try {
        const userId = req.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Parámetros inválidos'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const carrito  = await Carrito.findOne({ userId: userId, is_active: true, status: 'PENDING' });
        if (!carrito) {
            return res.status(404).json({
                success: false,
                message: 'Carrito no encontrado'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Carrito encontrado exitosamente',
            data: carrito.merchandising
        });

    // } catch (error) {
    //     return res.status(500).json({
    //         success: false,
    //         message: 'Error interno del servidor',
    //         error: error
    //     });
    // }   
}

module.exports = {
    getMerchandising,
    getMerchandisingCarrito
}