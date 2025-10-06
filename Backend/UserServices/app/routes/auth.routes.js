module.exports = (app) => {
    const auth = require('../controllers/auth.controller.js');

    //Register
    app.post('/api/register', auth.registerUser);

    //Login
    app.post('/api/login', auth.loginUser);
    
};