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
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Token no valido" });
            }
            req.loggedIn = true;
            req.id = decoded.id;
            req.public_id = decoded.public_id;
            req.email = decoded.email;
            req.username = decoded.username;

            next();
        }
    )
};

module.exports = verifyJWTOpcional;