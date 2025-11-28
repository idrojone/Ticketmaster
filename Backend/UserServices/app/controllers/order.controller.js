const User = require('../models/user.model');
const Cart = require('../models/carrito.model');
const axios = require('axios');

async function createOrder(req, res) {

    const userId = req.id;


    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Usuario no encontrado'
        });
    }

    const cart = await Cart.findById(req.body.cartId);
    if (!cart) {
        return res.status(404).json({
            success: false,
            message: 'Carrito no encontrado'
        });

    }

    const response = await axios.post('http://localhost:3010/order', {
        cartId: req.body.cartId
    });

    return res.status(200).json({
        success: true,
        message: 'Orden creada exitosamente',
        data: response.data
    });
}


module.exports = {
    createOrder
}
