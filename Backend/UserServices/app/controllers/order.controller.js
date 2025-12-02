const User = require('../models/user.model');
const Cart = require('../models/carrito.model');
const axios = require('axios');
const jwt = require('jsonwebtoken');

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

    const cartIdString = cart._id.toString();

    const token = await jwt.sign({ role: 'server' }, process.env.JWT_SECRET, { expiresIn: '4s' });
    try {
        const authHeader = req.headers['authorization'] || `Bearer ${token}`;

        const response = await axios.post('http://localhost:3010/order', {
            cartId: cartIdString
        }, {
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader ? { 'Authorization': authHeader } : {})
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Orden creada exitosamente',
            data: response.data
        });
    } catch (error) {
        console.error('Error llamando a DashboardAdmin:', error.response?.data || error.message);
        const statusCode = error.response?.status || 500;
        const errorData = error.response?.data || { message: error.message };
        return res.status(statusCode).json({
            success: false,
            message: 'Error creando orden',
            error: errorData
        });
    }
}


module.exports = {
    createOrder
}
