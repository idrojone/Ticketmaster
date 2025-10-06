const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {

    //Obtenemos el token del header
    const authHeader = req.headers.authorization || req.headers.Authorization;

    //Comprobamos que empieza por Bearer
    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({message: "No autorizado"});
    }

    //Obtenemos el token
    const token = authHeader.split(' ')[1];

    //Verificamos el token
    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decoded) => {
            //Si da error al decodificar
            if(err){
                return res.status(403).json({message: "Token no valido"});
            }

            //Si es valido
            req.id = decoded.id;
            req.email = decoded.email;
            req.username = decoded.username;
            req.password = decoded.password;
            
            next();
        }
    );
};

module.exports = verifyJWT;