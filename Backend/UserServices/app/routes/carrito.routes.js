module.exports = (app) => {
    const verifyJWT = require('../middleware/verifyJWT');
    const carritoController = require('../controllers/carrito.controller');

    app.post('/carrito', verifyJWT, carritoController.createCarrito);
    app.put('/carrito/:id', verifyJWT, carritoController.updateCarrito);
    app.get('/carrito/get', verifyJWT, carritoController.getCarrito);
    app.put('/carrito/:id/status', verifyJWT, carritoController.updateStatus);
    app.put('/carrito/:id/active', verifyJWT, carritoController.updateActive);
}