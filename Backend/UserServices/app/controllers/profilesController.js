const User = require('../models/user.model.js');
const asyncHandler = require('express-async-handler');

const getProfile = asyncHandler(async (req, res) => {
    console.log(req);
    const { username } = req.params;
    const loggedin = req.loggedin;

    const user = await User.findOne({ username }).exec();

    if (!user) return res.status(404).json({ message: "User Not Found" });

    if (!loggedin) {
        return res.status(200).json({
           profile: user.toUserDetails(false),
        });
    } else {
        const loginUser = await User.findOne({ email: req.userEmail }).exec();
        return res.status(200).json({
            profile: user.toUserDetails(loginUser),
        });
    }
});

const followUser = asyncHandler(async (req, res) => {
    const { username } = req.params;
    
    const user = await User.findOne({ username }).exec();

    if (!user) return res.status(404).json({ message: "User Not Found" });

    await user.follow(req.username);
    
    return res.status(200).json({
        profile: user.toUserDetails(true),
    });
});

module.exports = {
    getProfile,
    followUser,
};