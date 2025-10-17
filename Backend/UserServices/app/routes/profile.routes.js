module.exports = (app) => {
    const verifyJWT = require("../middleware/verifyJWT.js");
    const verifyJWTOpcional = require("../middleware/verifyJWTOpcional.js");
    const profileController = require("../controllers/profilesController.js");

    app.get('/:username', verifyJWTOpcional, profileController.getProfile);
    app.post('/:username/follow', verifyJWT, profileController.followUser);

};