module.exports = (app) => {

    const carousel = require('../controllers/carousel.controller.js');

    // Generos para el carousel
    app.get('/api/carousel', carousel.findAllGenerosCarousel);

};