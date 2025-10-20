const User = require('../models/user.model.js');
const asyncHandler = require('express-async-handler');
const Concierto = require('../models/concierto.model.js');

const getProfile = asyncHandler(async (req, res) => {
    // console.log(req);
    const { username } = req.params;
    const loggedin = req.loggedin;

    const user = await User.findOne({ username }).exec();

    if (!user) return res.status(404).json({ message: "User Not Found" });

    if (!loggedin) {
        return res.status(200).json({
           profile: await user.toUserDetails(),
        });
    } else {
        const loginUser = await User.findOne({ email: req.userEmail }).exec();
        return res.status(200).json({
            profile: await user.toUserDetails(),
        });
    }
});

const followUser = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const { id } = req;
    console.log(req, id);
    console.log(`follow user: ${username}`);
    
    const user = await User.findOne({ username }).exec();

    if (!user) return res.status(404).json({ message: "User Not Found" });

    await user.follow(req.id);

    return res.status(200).json({
        profile: await user.toUserDetails(),
    });
});

const unfollowUser = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({ username }).exec();

    if (!user) return res.status(404).json({ message: "User Not Found" });
    await user.unfollow(req.id);

    return res.status(200).json({
        profile:  await user.toUserDetails(),
    });
});

const getUserComentarios = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const loggedin = req.loggedIn;

    const user = await User.findOne({ username }).exec();

    if (!user) return res.status(404).json({ message: "User Not Found" });

    return res.status(200).json({
        profile: await user.UserComentarios(user._id),
    });

    // if (!loggedin) {
    //     return res.status(200).json({
    //         profile: await user.UserComentarios(user._id),
    //     });
    // } else {
    //     return res.status(200).json({
    //         profile: await user.UserComentarios(user._id),
    //     });
    // }
});

const getUserLikes = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const loggedin = req.loggedIn;

    const user = await User.findOne({ username }).exec();

    console.log(user.favouriteConciertos);

    if (!user.favouriteConciertos || user.favouriteConciertos.length === 0) {
        return res.status(200).json({ likes: [] });
    }

    const conciertos = await Concierto.find({ _id: { $in: user.favouriteConciertos } }).exec();

    return res.status(200).json({
        likes: conciertos
    });


});

module.exports = {
    getProfile,
    followUser,
    unfollowUser,
    getUserComentarios,
    getUserLikes,
};