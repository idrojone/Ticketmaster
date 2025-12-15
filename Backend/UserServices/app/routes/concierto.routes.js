module.exports = (app) => {
    const conciertos = require('../controllers/concierto.controller.js');
    const verifyJWT = require('../middleware/verifyJWT.js');

    //Get all conciertos
    app.get('/api/conciertos', conciertos.findAllConciertos);

    app.get('/api/conciertos/:slug', conciertos.findOneConcierto);
    
    // app.post('/api/conciertos', conciertos.createConcierto);
    // app.put('/api/conciertos/:slug', conciertos.updateConcierto);
    // app.delete('/api/conciertos/:slug', conciertos.deleteConcierto);
    // app.delete('/api/conciertos', conciertos.deleteAllConciertos);

    app.get('/api/conciertos/genero/:slug', conciertos.findConciertosByGenero);
    app.get('/api/ciudades/', conciertos.findAllCiudades);

    // Likes 

    app.post('/api/conciertos/like/:slug', verifyJWT, conciertos.likeConcierto);
    app.delete('/api/conciertos/unlike/:slug', verifyJWT, conciertos.unlikeConcierto);
    // app.get('/api/conciertos/:id_genero', conciertos.findConciertosByGenero);

    // app.get('/api/conciertos-query', conciertos.findAllQuery);

    app.post('/api/conciertosIA', conciertos.buscadorIA);
    
};