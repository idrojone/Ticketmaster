module.exports = (app) => {
    const conciertos = require('../controllers/concierto.controller.js');

    //Get all conciertos
    app.get('/api/conciertos', conciertos.findAllConciertos);
    app.get('/api/conciertos/:slug', conciertos.findOneConcierto);
    app.post('/api/conciertos', conciertos.createConcierto);
    app.put('/api/conciertos/:slug', conciertos.updateConcierto);
    app.delete('/api/conciertos/:slug', conciertos.deleteConcierto);
    app.delete('/api/conciertos', conciertos.deleteAllConciertos);
};