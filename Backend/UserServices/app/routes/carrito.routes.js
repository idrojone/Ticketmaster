module.exports = (app) => {
    const verifyJWT = require('../middleware/verifyJWT');
    const carritoController = require('../controllers/carrito.controller');

    app.post('/carrito', verifyJWT, carritoController.createCarrito);
    app.put('/carrito/:id', verifyJWT, carritoController.updateCarrito);
    app.get('/carrito/:id', verifyJWT, carritoController.getCarrito);
}