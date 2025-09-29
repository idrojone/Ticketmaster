module.exports = (app) => {
    const generos = require('../controllers/genero.controller.js');

    app.post('/api/generos', generos.create);
    app.get('/api/generos', generos.findAllGeneros);
    app.get('/api/generos/:slug', generos.findOneGenero);

}
