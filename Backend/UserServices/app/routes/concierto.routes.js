module.exports = (app) => {
    const conciertos = require('../controllers/concierto.controller.js');

    //Get all conciertos
    app.get('/api/conciertos', conciertos.findAllConciertos);
};