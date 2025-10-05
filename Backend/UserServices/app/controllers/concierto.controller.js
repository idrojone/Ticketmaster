const Concierto = require('../models/concierto.model.js');
const SpotifyAPI = require('../utils/SpotifyAPI.js');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const GeneroModel = require('../models/genero.model.js');

async function findAllConciertos(req, res) {
    console.log(req.query, "query");
    let query = {};
    const spotifyAPI = new SpotifyAPI();

    const tratarUndefined = (varQuery, otroResultado) => {
        return varQuery !== undefined ? varQuery : otroResultado;
    }

    let limit = tratarUndefined(req.query.limit, 10);
    let offset = tratarUndefined(req.query.offset, 0);

    let genero = tratarUndefined(req.query.genero, "");
    let nombre = tratarUndefined(req.query.nombre, "");
    let fecha_inicio = tratarUndefined(req.query.fecha_inicio, null);
    let fecha_fin = tratarUndefined(req.query.fecha_fin, null);

    // Manejar valores undefined que vienen del frontend
    if (genero === "undefined") genero = "";
    if (nombre === "undefined") nombre = "";
    if (fecha_inicio === "undefined") fecha_inicio = null;
    if (fecha_fin === "undefined") fecha_fin = null;

    console.log("Parámetros procesados:", { genero, nombre, fecha_inicio, fecha_fin })

    let nombreReg = new RegExp(nombre, 'i'); // 'i' para case-insensitive

    query = {
        nombre: { $regex: nombreReg }
    };

    if (fecha_inicio && fecha_fin) {
        // Las fechas en BD están como strings ISO, comparamos como strings
        const fechaInicioISO = fecha_inicio + "T00:00:00.000Z";
        const fechaFinISO = fecha_fin + "T23:59:59.999Z";
        query.fecha = {
            $gte: fechaInicioISO,
            $lte: fechaFinISO
        };
    } else if (fecha_inicio) {
        query.fecha = { $gte: fecha_inicio + "T00:00:00.000Z" };
    } else if (fecha_fin) {
        query.fecha = { $lte: fecha_fin + "T23:59:59.999Z" };
    }

    if (genero !== "") {
        const generoFound = await GeneroModel.findOne({ slug: genero });
        if (generoFound) {
            genero = generoFound.id_genero;
            query.id_genero = genero;
        }
    } else {
        console.log("No se ha proporcionado género");
    }


    console.log("Query final:", JSON.stringify(query, null, 2));

    const conciertos = await Concierto.find(query).skip(Number(offset)).limit(Number(limit));
    const concierto_count = await Concierto.find(query).countDocuments();

    const concierosWithImages = await Promise.all(conciertos.map(async concierto => {
        if (!concierto.imagenArtista) {
            const artistaInfo = await spotifyAPI.getArtistImg(concierto.artista);
            if (artistaInfo && artistaInfo.image) {
                await Concierto.findByIdAndUpdate(concierto._id, { imagenArtista: artistaInfo.image });
                concierto.imagenArtista = artistaInfo.image;
            }
        }
        return concierto;
    }));

    return res.status(200).json({
        conciertos: await Promise.all(concierosWithImages.map(async concierto => {
            return await concierto.toConciertoResponse();
        })),
        concierto_count: concierto_count
    });
}

const findAllConciertosQuery = asyncHandler(async(req, res) => {
    // console.log(req.query);
    let query = {};
    const spotifyAPI = new SpotifyAPI();

    let tratarUndefined = (varQuery, otroResultado) => {
        return varQuery !== undefined ? varQuery : otroResultado;
    }

    let limit = tratarUndefined(req.query.limit, 10);
    let offset = tratarUndefined(req.query.offset, 0);
    
    let genero_filtro = tratarUndefined(req.query.genero, "");
    let nombre = tratarUndefined(req.query.nombre, "");
    let priceMin = tratarUndefined(req.query.priceMin, 0);
    let priceMax = tratarUndefined(req.query.priceMax, Number.MAX_SAFE_INTEGER);

    let nombreReg = new RegExp(nombre);

    query = {
        nombre: { $regex: nombreReg },
        $and: [{ precio: { $gte: priceMin } }, { precio: { $lte: priceMax } }]
    }

    console.log(genero_filtro);

    if (genero_filtro !== "") {
        const generoFound = await GeneroModel.findOne({ slug: genero_filtro });
        if (generoFound) {
            query.id_genero = generoFound.id_genero;
        }
    }

    console.log(query);

    const conciertos = await Concierto.find(query)
    const concierto_count = await Concierto.find(query).countDocuments();

    if (!conciertos) {
        res.status(404).json({ msg: "Ha ocurrido un error" });
    }

    return res.status(200).json({
        conciertos: await Promise.all(conciertos.map(async concierto => {
            return await concierto.toConciertoResponse();
        })),
        concierto_count: concierto_count
    });

});

async function findOneConcierto(req, res) {
    try {
        const slug = req.params.slug;
        const concierto =  await Concierto.findOne({ slug });

        if (!concierto) {
            return res.status(404).json({ message: 'Concierto no encontrado', status: 404 });
        } else {
            res.json(concierto);
        }
    } catch (error) {
        res.status(500).json("Ha ocurrido un error", res.statusCode);
    }
}

async function createConcierto(req, res) {
    try {
        console.log('req.body:', req.body); 
        
        const { nombre, fecha, artista, lugar, precio, duracion, aforo, id_genero, descripcion, imagenesShow } = req.body;
        
        const camposRequeridos = { nombre, fecha, artista, lugar, precio, duracion, aforo, id_genero };
        const camposFaltantes = Object.keys(camposRequeridos).filter(key => !camposRequeridos[key]);

        if (camposFaltantes.length > 0) {
            return res.status(400).json({ 
                message: `Faltan datos obligatorios: ${camposFaltantes.join(', ')}`, 
                status: 400 
            });
        }

        const find_genero = await GeneroModel.findOne({ id_genero: id_genero });

        if (!find_genero) {
            return res.status(404).json({ 
                message: `Genero con id_genero '${id_genero}' no encontrado`, 
                status: 404 
            });
        }

        const data = {
            nombre,
            fecha,
            artista,
            lugar,
            precio: Number(precio),
            aforo: Number(aforo),
            duracion: Number(duracion),
            id_genero,
            longitud: req.body.longitud || null,
            latitud: req.body.latitud || null,
            descripcion: descripcion || '',
            imagenesShow: imagenesShow || []
        };

        console.log('data a guardar:', data); // Debug

        const newConcierto = new Concierto(data);
        const newConciertoSaved = await newConcierto.save();
        
        // Agregar el concierto al género
        await find_genero.addConcierto(newConciertoSaved._id);

        return res.status(201).json({
            success: true,
            message: 'Concierto creado correctamente',
            concierto: newConciertoSaved,
            status: 201
        });
    } catch (error) {
        console.error('Error al crear concierto:', error); // Debug mejorado
        return res.status(500).json({ 
            message: 'Ha ocurrido un error al crear el concierto', 
            error: error.message,
            status: 500 
        });
    }
}

async function updateConcierto(req, res) {
    try {
        const slug = req.params.slug;
        const { nombre, fecha, artista, lugar, precio } = req.body;


        // avisar quins datos falten
        const faltan = [];
        if (!nombre) faltan.push('nombre');
        if (!fecha) faltan.push('fecha');
        if (!artista) faltan.push('artista');
        if (!lugar) faltan.push('lugar');
        if (!precio) faltan.push('precio');

        if (faltan.length > 0) {
            return res.status(400).json({ 
                message: `Faltan datos obligatorios: ${faltan.join(', ')}`, 
                status: 400 
            });
        }

        const conciertoExistente = await Concierto.findOne({ slug });
        if (!conciertoExistente) {
            return res.status(404).json({ message: 'Concierto no encontrado', status: 404 });
        }

        const nombreCambio = conciertoExistente.nombre !== nombre;

        conciertoExistente.nombre = nombre;
        conciertoExistente.fecha = fecha;
        conciertoExistente.artista = artista;
        conciertoExistente.lugar = lugar;
        conciertoExistente.precio = precio;

        if (nombreCambio) {
            conciertoExistente.slug = undefined; // per a que canvie el slug
        }

        const conciertoUpdated = await conciertoExistente.save();
        res.json(conciertoUpdated);
    } catch (error) {
        res.status(500).json("Ha ocurrido un error", res.statusCode);
    }
}

async function deleteConcierto(req, res) {
    try {
        const slug = req.params.slug;

        const concierto = await Concierto.findOneAndDelete({ slug });

        if (!concierto) {
            return res.status(404).json({ message: 'Concierto no encontrado', status: 404 });
        } 

        const GeneroTarget = await genero.findById(concierto.id_genero);

        try {
            await GeneroTarget.removeConcierto(concierto._id);
            // console.log(concierto._id.toString());
            return res.json({ message: 'Concierto eliminado correctamente', status: 200 });
        } catch (error) {
            return res.status(500).json({ message: 'Error al eliminar concierto de el género', status: 500 });
        }
        

    } catch (error) {
        res.status(500).json("Ha ocurrido un error", res.statusCode);
    }
}

async function deleteAllConciertos(req, res) {
    try {
        await Concierto.deleteMany();
        res.json({ message: 'Todos los conciertos eliminados correctamente', status: 200 });
    } catch (error) {
        res.status(500).json("Ha ocurrido un error", res.statusCode);
    }
}

async function findConciertosByGenero(req, res) {
    try {
        const slug = req.params.slug;

        const generoFound = await GeneroModel.findOne({slug}).exec();

        if (!generoFound) {
            return res.status(404).json({ message: "Genero no encontrado", status: 404 });
        }

        return await res.status(200).json({
            conciertos: await Promise.all(generoFound.conciertos.map(async conciertoId => {
                const concierto=await Concierto.findById(conciertoId);
                return concierto;
            }))
        });

    } catch (error) {
        res.status(500).json("Ha ocurrido un error", res.statusCode);
    }
}


const concierto_controller = {
    findAllConciertos: findAllConciertos,
    findOneConcierto: findOneConcierto,
    createConcierto: createConcierto,
    updateConcierto: updateConcierto,
    deleteConcierto: deleteConcierto,
    deleteAllConciertos: deleteAllConciertos,
    findConciertosByGenero: findConciertosByGenero,
    findAllConciertosQuery: findAllConciertosQuery,
    // findAllQuery: findAllQuery
};

module.exports = concierto_controller;