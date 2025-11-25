const jwt = require('jsonwebtoken');
const BlackListToken = require('../models/blackListToken');
const RefreshTokenStore = require('../models/refreshTokenStore.model');
const User = require('../models/user.model');

const verifyJWT = async (req, res, next) => {
    // Obtenemos el token del header
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Comprobamos que empieza por Bearer
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No autorizado" });
    }

    // Obtenemos el access token
    const accessToken = authHeader.split(' ')[1];

    // Ver si el token está en la blacklist
    const blacklistedToken = await BlackListToken.findOne({ token: accessToken });

    // Verificamos el token
    jwt.verify(
        accessToken,
        process.env.JWT_SECRET,
        { ignoreExpiration: true }, // Permite verificar tokens expirados
        async (err, decoded) => {
            // Si hay error de firma/formato (no expiración)
            if (err && err.name !== 'TokenExpiredError') {
                return res.status(401).json({ message: "Token no valido", error: err.message });
            }

            // Si el token NO está expirado y no está en blacklist, continuar normalmente
            if (!err && !blacklistedToken) {
                req.id = decoded.id;
                req.public_id = decoded.public_id;
                req.email = decoded.email;
                req.username = decoded.username;
                req.blacklisted = false;
                req.rol = decoded.role;

                console.log("Decoded JWT válido:", decoded);
                return next();
            }

            // Intentamos usar el refresh token de las cookies
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                console.warn('Access token expirado/blacklist y no hay refresh token en cookies');
                return res.status(401).json({
                    message: "Access token expirado. No hay refresh token disponible.",
                    error: "no_refresh_token"
                });
            }

            // Validar que el refresh token existe en BD
            const storedRefreshToken = await RefreshTokenStore.findOne({ refreshToken });

            if (!storedRefreshToken) {
                console.warn('Refresh token no encontrado en BD');
                return res.status(401).json({
                    message: "Refresh token no válido",
                    error: "invalid_refresh"
                });
            }

            // Validar que el refresh token no está en blacklist
            const isRefreshBlacklisted = await BlackListToken.findOne({ token: refreshToken });
            if (isRefreshBlacklisted) {
                console.warn('Refresh token está en blacklist');
                return res.status(401).json({
                    message: "Refresh token en blacklist",
                    error: "refresh_blacklisted"
                });
            }

            // Verificar la firma del refresh token
            jwt.verify(
                refreshToken,
                process.env.JWT_SECRET,
                { ignoreExpiration: true },
                async (refreshErr, refreshDecoded) => {
                    // Error de firma o formato del refresh token
                    if (refreshErr && refreshErr.name !== 'TokenExpiredError') {
                        console.warn('Refresh token inválido (firma/formato):', refreshErr.message);
                        return res.status(401).json({
                            message: "Refresh token inválido",
                            error: "refresh_invalid_signature"
                        });
                    }

                    // Refresh token está expirado
                    if (refreshErr && refreshErr.name === 'TokenExpiredError') {
                        console.warn('Refresh token expirado');

                        // Marcar el refresh token como expirado (agregar a blacklist)
                        const decodedRefreshExpired = jwt.decode(refreshToken) || {};
                        const userIdFromRefreshExpired = decodedRefreshExpired.id || null;

                        if (userIdFromRefreshExpired) {
                            try {
                                await BlackListToken.create({
                                    userId: userIdFromRefreshExpired,
                                    token: refreshToken
                                });
                                await RefreshTokenStore.deleteOne({ refreshToken });
                            } catch (e) {
                                console.warn('Error agregando refresh expirado a blacklist:', e.message);
                            }
                        }

                        return res.status(401).json({
                            message: "Refresh token expirado. Por favor, inicie sesión nuevamente.",
                            error: "refresh_expired"
                        });
                    }

                    // Refresh token es válido. Verificar que no esté expirado manualmente
                    const isRefreshExpired = refreshDecoded && (Date.now() >= refreshDecoded.exp * 1000);
                    if (isRefreshExpired) {
                        console.warn('Refresh token expirado (verificación manual)');

                        const userIdFromRefreshDecoded = refreshDecoded && (refreshDecoded.id || null);
                        if (userIdFromRefreshDecoded) {
                            try {
                                await BlackListToken.create({
                                    userId: userIdFromRefreshDecoded,
                                    token: refreshToken
                                });
                                await RefreshTokenStore.deleteOne({ refreshToken });
                            } catch (e) {
                                console.warn('Error agregando refresh expirado a blacklist:', e.message);
                            }
                        }

                        return res.status(401).json({
                            message: "Refresh token expirado. Por favor, inicie sesión nuevamente.",
                            error: "refresh_expired"
                        });
                    }

                    // Obtener el usuario y generar un nuevo access token
                    const userId = refreshDecoded.id;
                    let user;

                    try {
                        user = await User.findById(userId);
                    } catch (e) {
                        console.warn('Error buscando usuario por ID:', e.message);
                        return res.status(401).json({
                            message: "Usuario no válido",
                            error: "invalid_user"
                        });
                    }

                    if (!user) {
                        console.warn('Usuario no encontrado para el refresh token');
                        await RefreshTokenStore.deleteOne({ refreshToken });
                        return res.status(401).json({
                            message: "Usuario no encontrado",
                            error: "user_not_found"
                        });
                    }

                    // Generar nuevo access token
                    try {
                        const newAccessToken = jwt.sign(
                            {
                                id: user.id,
                                email: user.email,
                                username: user.username
                            },
                            process.env.JWT_SECRET,
                            { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
                        );

                        // Devolver el nuevo access token en header X-Access-Token
                        res.setHeader('X-Access-Token', newAccessToken);

                        // Establecer datos del usuario en la request para continuar
                        req.id = user.id;
                        req.email = user.email;
                        req.username = user.username;
                        req.blacklisted = false;
                        req.rol = user.role;

                        // Continuar con la request
                        next();
                    } catch (e) {
                        console.error('Error generando nuevo access token:', e.message);
                        return res.status(500).json({
                            message: "Error regenerando token",
                            error: "token_generation_error"
                        });
                    }
                }
            );
        }
    );
};

module.exports = verifyJWT;