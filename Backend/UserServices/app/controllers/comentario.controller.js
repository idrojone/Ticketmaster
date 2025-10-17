const User = require('../models/user.model.js');
const Concierto = require('../models/concierto.model.js');
const Comentario = require('../models/comentario.model.js');

const anadirComentarioConcierto = async (req, res) =>  {
    const userId = req.id;
    const user = await User.findById(userId).exec();
    const { slug } = req.params;
    const concierto = await Concierto.findOne({slug}).exec();
    const { contenido } = req.body;

    if(!user) return res.status(401).json({message: "Usuario no encontrado"});

    if(!concierto) return res.status(404).json({message: "Concierto no encontrado"});

    const nuevoComentario =  await Comentario.create({
        contenido: contenido,
        autor: user._id,
        conciertoSlug: slug
    });

    await concierto.anadirComentario(nuevoComentario._id);
    return res.status(201).json({ comentario: await nuevoComentario.toComentarioResponse() });

}

const obtenerComentariosConcierto = async (req, res) => {
    const { slug } = req.params;
    const concierto = await Concierto.findOne({slug}).exec();

    if(!concierto) return res.status(404).json({message: "Concierto no encontrado"});

    const loggedIn = req.loggedIn || false;

    if (loggedIn) {
        const user = await User.findById(req.id).exec();
        if(!user) return res.status(401).json({message: "Usuario no encontrado"});
        return res.status(200).json({
            comentarios: await Promise.all(
                concierto.comentarios.map(async (comentarioId) => {
                    console.log(comentarioId)
                    const comentario = await Comentario.findById(comentarioId).exec();
                    return await comentario.toComentarioResponse();
                })
            )
        });
    } else {
        return res.status(200).json({
            comentarios: await Promise.all(
                concierto.comentarios.map(async (comentarioId) => {
                    const comentario = await Comentario.findById(comentarioId).exec();
                    return await comentario.toComentarioResponse();
                })
            )
        });
    }
}

const borrarComentarioConcierto = async (req, res) => {
    const userId = req.id;
    const user = await User.findById(userId).exec();

    if(!user) return res.status(401).json({message: "Usuario no encontrado"});

    const { slug, id } = req.params;

    // console.log("Slug:", slug);

    const concierto = await Concierto.findOne({slug}).exec();

    if(!concierto) return res.status(404).json({message: "Concierto no encontrado"});

    const comentario = await Comentario.findById(id).exec();

    if(!comentario) return res.status(404).json({message: "Comentario no encontrado"});

    if(comentario.autor.toString() !== userId.toString()) {
        return res.status(403).json({message: "No autorizado para borrar este comentario"});
    } else {
        await concierto.borrarComentario(id);
        await Comentario.findByIdAndDelete(id).exec();
        return res.status(200).json({message: "Comentario borrado correctamente"});
    }
}

module.exports = {
    anadirComentarioConcierto,
    obtenerComentariosConcierto,
    borrarComentarioConcierto
};