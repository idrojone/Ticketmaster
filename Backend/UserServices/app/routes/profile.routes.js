module.exports = (app) => {
    const verifyJWT = require("../middleware/verifyJWT.js");
    const verifyJWTOpcional = require("../middleware/verifyJWTOpcional.js");
    const profileController = require("../controllers/profilesController.js");

    app.get('/:username', verifyJWTOpcional, profileController.getProfile);
    app.get('/:username/user/comentarios', verifyJWTOpcional, profileController.getUserComentarios);
    app.post('/:username/user/follow', verifyJWT, profileController.followUser);
    app.delete('/:username/user/unfollow', verifyJWT, profileController.unfollowUser);

};