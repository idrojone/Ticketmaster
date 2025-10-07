module.exports = (app) => {
    const conciertos = require('../controllers/concierto.controller.js');

    //Get all conciertos
    app.get('/api/conciertos', conciertos.findAllConciertos);

    app.get('/api/conciertos/:slug', conciertos.findOneConcierto);
    
    app.post('/api/conciertos', conciertos.createConcierto);
    app.put('/api/conciertos/:slug', conciertos.updateConcierto);
    app.delete('/api/conciertos/:slug', conciertos.deleteConcierto);
    app.delete('/api/conciertos', conciertos.deleteAllConciertos);

    app.get('/api/conciertos/genero/:slug', conciertos.findConciertosByGenero);
    app.get('/api/ciudades/', conciertos.findAllCiudades);
    // app.get('/api/conciertos/:id_genero', conciertos.findConciertosByGenero);

    // app.get('/api/conciertos-query', conciertos.findAllQuery);
};