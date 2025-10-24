const jwt = require('jsonwebtoken');
const BlackListToken = require('../models/blackListToken');

const verifyJWT = async (req, res, next) => {

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


    //Ver si mi token esta en la blacklist
    const blacklistedToken = await BlackListToken.findOne({ token: token });
    //Verificamos el token
    jwt.verify(
        token,
        process.env.JWT_SECRET,
        { ignoreExpiration: true }, // Permite verificar tokens expirados
        async (err, decoded) => {
            //Si da error al decodificar (firma inválida, formato incorrecto)
            if(err && err.name !== 'TokenExpiredError'){
                return res.status(403).json({message: "Token no valido", error: err.message});
            }

            // Si el token está expirado, añadir a blacklist
            if(err && err.name === 'TokenExpiredError'){
                const decodedExpired = jwt.decode(token);
                
                await BlackListToken.create({
                    id: decodedExpired.id,
                    token: token
                });

                return res.status(403).json({ message: "Access token expirado y agregado a blacklist", error: "jwt expired" });
            }

            // Verificación adicional de expiración manual
            const isExpired = Date.now() >= decoded.exp * 1000;
            if (isExpired) {
                await BlackListToken.create({
                    id: decoded.id,
                    token: token
                });

                return res.status(403).json({ message: "Access token expirado y agregado a blacklist", error: "jwt expired" });
            }

            if(blacklistedToken){  //Si esta en la blacklist
                req.blacklisted = true;
            }else{
                req.blacklisted = false;
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