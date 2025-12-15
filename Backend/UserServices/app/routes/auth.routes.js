module.exports = (app) => {
    const auth = require('../controllers/auth.controller.js');
    const verifyJWT = require('../middleware/verifyJWT.js');

    //Register
    app.post('/api/register', auth.registerUser);

    //Login
    app.post('/api/login',auth.loginUser);

    //Refresh Token
    app.post('/api/refresh', auth.verifyRefreshToken);

    //Logout
    app.post('/api/logout', auth.logoutUser);

    //Get User Data
    app.get('/api/user', verifyJWT, auth.getUserData);

    //Update User Data
    app.put('/api/user', verifyJWT, auth.updateUser);

    //Get User Details by username
    app.get('/api/user/:username', auth.getDetailsUser);
    
};