module.exports = (app) => {
    const merchandising = require('../controllers/merchandising.controller');
    const verifyJWT = require("../middleware/verifyJWT.js");

    app.get('/merchandising/:id',merchandising.getMerchandising);
    // app.get('/api/merchandising', verifyJWT, merchandising.getMerchandisingCarrito);
}