module.exports = function (app) {
    const verifyJWT = require('../middleware/verifyJWT');
    const orderController = require('../controllers/order.controller');

    app.post('/create-payment-intent', verifyJWT, orderController.createOrder);
}