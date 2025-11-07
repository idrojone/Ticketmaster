const jwt = require('jsonwebtoken');

const verifyJWTOpcional = (req, res, next) => {
    
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.loggedIn = false;
        return next();
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        { ignoreExpiration: true },  
        (err, decoded) => {
            if (err && err.name !== 'TokenExpiredError') {
                return res.status(401).json({ message: "Token expirado" });
            }

            // Verificación adicional de expiración manual
            const isExpired = decoded && (Date.now() >= decoded.exp * 1000);
            if (isExpired) {
                console.warn('Token expirado detectado en verifyJWTOpcional');
                return res.status(401).json({ message: "Token expirado" });
            }

            // Token válido y no expirado
            req.loggedIn = true;
            req.id = decoded.id;
            req.public_id = decoded.public_id;
            req.email = decoded.email;
            req.username = decoded.username;
            req.rol = decoded.role;

            next();
        }
    )
};

module.exports = verifyJWTOpcional;