const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {

    //Obtenemos el token del header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    // console.log("Authorization Header:", authHeader);

    //Comprobamos que empieza por Bearer
    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({message: "No autorizado"});
    }

    //Obtenemos el token
    const token = authHeader.split(' ')[1];
    // console.log("Token:", token);

    //Verificamos el token
    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decoded) => {
            //Si da error al decodificar
            if(err){
                return res.status(403).json({message: "Token no valido", error: err.message});
            }

            //Si es valido
            req.id = decoded.id;
            req.public_id = decoded.public_id;
            req.email = decoded.email;
            req.username = decoded.username;

            console.log("Decoded JWT:", decoded);

            next();
        }
    );
};

module.exports = verifyJWT;