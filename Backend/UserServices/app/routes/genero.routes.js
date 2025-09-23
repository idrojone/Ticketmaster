module.exports = (app) => {
    const generos = require('../controllers/genero.controller.js');

    app.post('/api/generos', generos.create);
    app.get('/api/generos', generos.findAllGeneros);
    app.get('/api/generos/:slug', generos.findOneGenero);
}

// module.exports = (app) => {
//     const categories = require('../controllers/category.controller.js');

//     // Create a new Note
//     app.post('/categories', categories.create);

//     // Retrieve all Notes
//     app.get('/categories', categories.findAll);

//     // Retrieve all Notes
//     app.get('/categories_select_filter', categories.findCategoriesSelect);

//     // Retrieve a single Note with noteId
//     // app.get('/categories/:slug', categories.findOne);

//     // Update a Note with noteId
//     // app.put('/productos/:id', products.update);

//     // Delete a Note with noteId
//     // app.delete('/categories/:slug', categories.delete_category);

//     // Delete todos los mf products
//     // app.delete('/productos_all', products.deleteAll);
// }