const User = require('../models/user.model');
const UserAdmin = require('../models/admin.model');
const UserEmpresa = require('../models/empresa.model');
const refreshTokenStore = require('../models/refreshTokenStore.model');
const asyncHandler = require('express-async-handler');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const BlackListToken = require('../models/blackListToken');


/**
 * Rutas públicas
 * - registerUser
 * - loginUser
 * - verifyRefreshToken
 * - logoutUser
 * 
 * Rutas privadas (pasar por el middleware de autenticación)
 * - getUserData
 * - updateUser
 * - getDetailsUser
 */

const registerUser = asyncHandler(async (req, res) => {

    const { user } = req.body;

    //Se asegura de que todos los campos esten llenos
    if (!user || !user.username || !user.email || !user.password) {
        return res.status(400).json({ message: "Asegurese de tener todos los campos" });
    }

    //Asegura que el email no este en uso
    const emailExist = await User.findOne({ email: user.email });
    if (emailExist) {
        return res.status(409).json({ message: "El email ya está en uso", type: "email" });
    }

    const usernameExist = await User.findOne({ username: user.username });
    if (usernameExist) {
        return res.status(409).json({ message: "El usuario ya está en uso", type: "username" });
    }

    //Hashear la contraseña
    const hashedPassword = await argon2.hash(user.password);

    //Definimos el objeto de Usuario
    const userObject = {
        "username": user.username,
        "email": user.email,
        "password": hashedPassword
    };

    //Crear el usuario
    const crearUsuario = await User.create(userObject);

    if (crearUsuario) {
        return res.status(201).json({
            user: await crearUsuario.toUserResponse(),
        });
    } else {
        return res.status(400).json({ message: "Error al crear el usuario" });
    }

});

const loginUser = asyncHandler(async (req, res) => {
    //Comprueba si estan todos los campos
    const { user } = req.body;

    if (!user || !user.email || !user.password) {
        return res
            .status(400)
            .json({ message: "Asegurese de tener todos los campos" });
    }

    //Mira si esta el Email
    const encontrarUsuario = await User.findOne({ email: user.email });

    if (!encontrarUsuario) {
        const encontrarUsuarioAdmin = await UserAdmin.findOne({ email: user.email });
        if (!encontrarUsuarioAdmin) {
            const encontrarUsuarioEmpresa = await UserEmpresa.findOne({ email: user.email });
            if (!encontrarUsuarioEmpresa) {
                return res.status(431).json({ message: "Email no encontrado en la base de datos" });
            }
            return res.status(200).json({ rol: 'empresa' });
        }
        return res.status(200).json({ rol: 'admin' });
    }

    //Si lo encuentra comprueba que la contraseña sea correcta
    const match = await argon2.verify(encontrarUsuario.password, user.password);

    if (!match) {
        return res.status(403).json({ message: "Contraseña incorrecta" });
    }

    //Generamos los tokens
    const accessToken = await generateAccessToken(encontrarUsuario);
    const refreshToken = await generateRefreshToken(encontrarUsuario);

    // Borramos los refresh tokens antiguos de este usuario
    await refreshTokenStore.deleteMany({ userId: encontrarUsuario._id });

    //Almacenamos el refresh token en el servidor
    await refreshTokenStore.create({
        userId: encontrarUsuario._id,
        refreshToken: refreshToken,
    });

    //Enviamos los tokens al cliente
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // Cambiar a true en producción con HTTPS
        sameSite: "lax", // lax permite cookies en navegación cross-site
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    });

    //Si todo ha ido correcto
    res.status(200).json({
        user: await encontrarUsuario.toUserResponse(accessToken),
        // accessToken: accessToken
    });
});

const logoutUser = asyncHandler(async (req, res) => {
    //Se lo pasamos por las cookies
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(400).json({ message: "No se ha recibido el refresh token" });
    }

    //Eliminamos el refresh token de la base de datos
    await refreshTokenStore.deleteOne({ refreshToken });

    //Eliminamos el refresh token de las cookies
    res.clearCookie("refreshToken", {
        path: '/',
    });

    res.status(200).json({ message: "Logout exitoso" });
});

//Acciones una vez autenticado --> Pasar por el middleware de autenticación

const getUserData = asyncHandler(async (req, res) => {

    if (req.blacklisted == true) {
        return res.status(403).json({ message: "Token en la blacklist" });
    }

    // Recibimos el email y lo buscamos
    const email = req.email;

    console.log('Email decodificado del token:', email);

    const encontrarUsuario = await User.findOne({ email }).exec();

    if (!encontrarUsuario) {
        const encontrarUsuarioAdmin = await UserAdmin.findOne({ email });
        if (!encontrarUsuarioAdmin) return res.status(404).json({ message: "Email del Usuario no encontrado" });
        return res.status(200).json({ rol: 'admin' });
    }

    res.status(200).json({
        user: await encontrarUsuario.toUserResponse()
    });

});

const updateUser = asyncHandler(async (req, res) => {

    if (req.blacklisted == true) {
        return res.status(403).json({ message: "Token en la blacklist" });
    }

    //Confirmar que tenemos un objeto para actualizar valido
    const { username, email, password, image, bio } = req.body.user;

    if (!username && !email) {
        return res.status(400).json({ message: "No puedes dejar el email y el usuario vacio" });
    }

    //Si los datos para actualizar son validos
    const emailDecoded = req.email;

    const encontrarUsuario = await User.findOne({ email: emailDecoded }).exec();

    if (!encontrarUsuario) {
        return res.status(404).json({ message: "No se puede actualizar un usuario que no existe" });
    }

    //Verificar que el nuevo email no esté en uso por otro usuario
    if (email && email !== emailDecoded) {
        const emailExist = await User.findOne({ email: email });
        if (emailExist) {
            return res.status(409).json({ message: "El email ya está en uso por otro usuario" });
        }
        encontrarUsuario.email = email;
    }

    //Verificar que el nuevo username no esté en uso por otro usuario
    if (username && username !== encontrarUsuario.username) {
        const usernameExist = await User.findOne({ username: username });
        if (usernameExist) {
            return res.status(409).json({ message: "El username ya está en uso por otro usuario" });
        }
        encontrarUsuario.username = username;
    }

    if (password) {
        //Hashear la contraseña
        const hashedPassword = await argon2.hash(password);
        encontrarUsuario.password = hashedPassword;
    }

    if (typeof image !== 'undefined') {
        encontrarUsuario.image = image;
    }

    if (typeof bio !== 'undefined') {
        encontrarUsuario.bio = bio;
    }

    await encontrarUsuario.save();

    res.status(200).json({
        user: await encontrarUsuario.toUserResponse()
    });
});

const getDetailsUser = asyncHandler(async (req, res) => {

    if (req.blacklisted == true) {
        return res.status(403).json({ message: "Token en la blacklist" });
    }

    const username = req.params.username;

    if (!username) {
        return res.status(400).json({ message: "No se ha especificado el username del usuario" });
    }

    const encontrarUsuario = await User.findOne({ username: username.toLowerCase() }).exec();

    if (!encontrarUsuario) {
        return res.status(404).json({ message: "No se ha encontrado el usuario" });
    }

    res.status(200).json({
        user: await encontrarUsuario.toUserDetails()
    });
});

//Acciones JWT

//Verificar Refresh Token
const verifyRefreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        console.log('❌ No hay refreshToken en cookies');
        return res.status(401).json({ message: "No autorizado, no hay refresh token" });
    }

    //Comprobamos si el refresh token existe en la base de datos
    const storedToken = await refreshTokenStore.findOne({ refreshToken });

    //Comprobamos si el refresh esta en la black list
    const isBlacklisted = await BlackListToken.findOne({ token: refreshToken });
    if (isBlacklisted) {
        console.log('Refresh token en blacklist');
        return res.status(403).json({ message: "Refresh token en la blacklist" });
    }

    if (!storedToken) {
        console.log('❌ Refresh token no encontrado en BD');
        return res.status(403).json({ message: "Refresh token no valido" });
    }

    //Verificamos el token
    jwt.verify(
        refreshToken,
        process.env.JWT_SECRET,
        { ignoreExpiration: true },
        async (err, decoded) => {
            // Si el token está expirado, añadir a blacklist
            if (err && err.name === 'TokenExpiredError') {
                // Decodificar para obtener el id del usuario
                const decodedExpired = jwt.decode(refreshToken) || {};
                const userIdFromExpired = decodedExpired.id || decodedExpired._id || null;

                if (userIdFromExpired) {
                    try {
                        const blackListToken = new BlackListToken({
                            userId: userIdFromExpired,
                            token: refreshToken
                        });
                        await blackListToken.save();
                    } catch (e) {
                        console.warn('No se pudo guardar BlackListToken (expired):', e.message);
                    }
                } else {
                    console.warn('Decoded token tiene no contiene id; no se añade a blacklist (expired).');
                }

                await refreshTokenStore.deleteOne({ refreshToken });

                return res.status(401).json({ message: "Refresh token caducado y agregado a blacklist" });
            }

            // Verificación adicional de expiración (por si ignoreExpiration está activo)
            const isExpired = !decoded || (decoded.exp && (Date.now() >= decoded.exp * 1000));
            if (isExpired) {
                const userIdFromDecoded = decoded && (decoded.id || decoded._id) || null;

                if (userIdFromDecoded) {
                    try {
                        const blackListToken = new BlackListToken({
                            userId: userIdFromDecoded,
                            token: refreshToken
                        });
                        await blackListToken.save();
                    } catch (e) {
                        console.warn('No se pudo guardar BlackListToken (isExpired):', e.message);
                    }
                } else {
                    console.warn('Decoded token no contiene id; no se añade a blacklist (isExpired).');
                }

                await refreshTokenStore.deleteOne({ refreshToken });

                return res.status(401).json({ message: "Refresh token caducado y agregado a blacklist" });
            }
            // //Si es valido, comprobamos que el usuario existe
            const userId = decoded.id;
            const user = await User.findById(userId);

            if (!user) {
                refreshTokenStore.deleteOne({ refreshToken });
                return res.status(401).json({ message: "Usuario no valido para este refresh token" });
            }

            //Si el token es valido, generamos un nuevo access token
            const newAccessToken = await generateAccessToken(user);
            // const newRefreshToken = await generateRefreshToken(user);

            res.status(200).json({ accessToken: newAccessToken });
        });
});

//Access 1h
const generateAccessToken = asyncHandler(async (user) => {
    //Definimos la estructura del payload
    const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
        rol: "user"
    };

    //Generamos el token, recordar añadir ACCESS_TOKEN_EXPIRATION a .env
    const accessToken = await jwt.sign(payload, process.env.JWT_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });

    return accessToken;
});

//Refresh 7d
const generateRefreshToken = asyncHandler(async (user) => {
    //Definimos la estructura del payload
    const payload = {
        id: user.id,
    };

    //Generamos el token, recordar añadir REFRESH_TOKEN_EXPIRATION a .env
    const refreshToken = await jwt.sign(payload, process.env.JWT_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });

    return refreshToken;
});

/////////////////////////////////////////////////////////77

const auth_controller = {
    registerUser: registerUser,
    loginUser: loginUser,
    logoutUser: logoutUser,
    verifyRefreshToken: verifyRefreshToken,
    getUserData: getUserData,
    updateUser: updateUser,
    getDetailsUser: getDetailsUser
};

module.exports = auth_controller;