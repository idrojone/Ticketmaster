const Entrada = require('../models/entradas.model');
const User = require('../models/user.model');

exports.getEntradas = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const entradas = await Entrada.find({ userId: user._id })
            .populate('conciertoId')
            .sort({ createdAt: -1 });

        return res.status(200).json({ entradas });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};