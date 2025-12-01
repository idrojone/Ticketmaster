module.exports = (app) => {
    const verifyJWT = require("../middleware/verifyJWT.js");
    const verifyJWTOpcional = require("../middleware/verifyJWTOpcional.js");
    const entradasController = require("../controllers/entradas.controller.js");

    app.get('/:username/user/entradas', verifyJWTOpcional, entradasController.getEntradas);
};