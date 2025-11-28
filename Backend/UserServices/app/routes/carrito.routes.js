module.exports = (app) => {
    const verifyJWT = require('../middleware/verifyJWT');
    const carritoController = require('../controllers/carrito.controller');

    app.get('/carrito/get', verifyJWT, carritoController.getCarrito);
    app.put('/carrito/status', verifyJWT, carritoController.updateStatus);
    app.put('/carrito/active', verifyJWT, carritoController.updateActive);
    app.post('/carrito/master', verifyJWT, carritoController.carritoMaster);

}