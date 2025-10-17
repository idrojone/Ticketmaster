module.exports = (app) => {
    const comentarios = require('../controllers/comentario.controller.js');
    const verifyJWT = require("../middleware/verifyJWT.js");
    
    app.post(':slug/comentarios', verifyJWT ,comentarios.anadirComentarioConcierto);
    app.get(':slug/comentarios', verifyJWTOpcional, comentarios.obtenerComentariosConcierto);
    app.delete(':slug/comentarios/:id', verifyJWT, comentarios.borrarComentarioConcierto);
};