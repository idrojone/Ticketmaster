module.exports = (app) => {
    const { getMerchandising } = require('../controllers/merchandising.controller');
    app.get('/merchandising/:id', getMerchandising);
}