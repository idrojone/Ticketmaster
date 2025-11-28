module.exports = function (app) {
    const verifyJWT = require('../middleware/verifyJWT');
    const orderController = require('../controllers/order.controller');

    app.post('/order', verifyJWT, orderController.createOrder);
}