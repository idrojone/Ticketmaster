const User = require('../models/user.model.js');

const anadirComentarioConcierto = async (req, res) =>  {
    const userId = req.userId;

    const user = await User.findById(userId).exec();

    if(!user) return res.status(401).json({message: "Usuario no encontrado"});

    const { slug } = req.params;

}