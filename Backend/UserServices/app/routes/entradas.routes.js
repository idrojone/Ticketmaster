module.exports = (app) => {
    const verifyJWT = require("../middleware/verifyJWT.js");
    const entradasController = require("../controllers/entradas.controller.js");

    app.get('/api/entradas', verifyJWT, entradasController.getEntradas);
};