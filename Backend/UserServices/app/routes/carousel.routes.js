module.exports = (app) => {

    const carousel = require('../controllers/carousel.controller.js');

    // Generos para el carousel
    app.get('/api/carousel/generos', carousel.findAllGenerosCarousel);

    // Conciertos para el carousel
    app.get('/api/carousel/conciertos', carousel.getAllConciertosCarrusel);
    app.get('/api/carousel/conciertos/:slug', carousel.getOneConciertoCarrusel);

};