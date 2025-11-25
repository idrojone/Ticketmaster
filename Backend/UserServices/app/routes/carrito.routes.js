module.exports = (app) => {
    const verifyJWT = require('../middleware/verifyJWT');
    const carritoController = require('../controllers/carrito.controller');

    app.post('/carrito', verifyJWT, carritoController.createCarrito);
    app.get('/carrito/:id', verifyJWT, carritoController.getCarrito);
}