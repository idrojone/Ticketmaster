const User=require('../models/user.model');
const asyncHandler=require('express-async-handler');
// const bcrypt=require('bcrypt');
const argon2 = require('argon2');

const registerUser= asyncHandler( async (req,res) => {

    const { user }=req.body;

    //Se asegura de que todos los campos esten llenos
    if(!user || !user.username || !user.email || !user.password){
        return res.status(400).json({message: "Asegurese de tener todos los campos"});
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
    // const hashedPassword= await bcrypt.hash(user.password,10);
    const hashedPassword = await argon2.hash(user.password);

    //Definimos el objeto de Usuario
    const userObject={
        "username": user.username,
        "email": user.email,
        "password": hashedPassword
    };

    //Crear el usuario
    const crearUsuario = await User.create(userObject);

    if(crearUsuario){
        return res.status(201).json({
            user: await crearUsuario.toUserResponse(),
        });
    }else {
        return res.status(400).json({message: "Error al crear el usuario"});
    }
    
});

const loginUser= asyncHandler( async (req,res) => {

    //Comprueba si estan todos los campos
    const { user }=req.body;

    if(!user || !user.email || !user.password){
        return res.status(400).json({message: "Asegurese de tener todos los campos"});
    }

    //Mira si esta el Email
    const encontrarUsuario= await User.findOne({ email: user.email });

    if(!encontrarUsuario){
        return res.status(401).json({message: "Email no encontrado en la base de datos"}); 
    }

    //Si lo encuentra comprueba que la contraseña sea correcta
    const match=await argon2.verify(encontrarUsuario.password, user.password);

    if(!match){
        return res.status(401).json({message: "Contraseña incorrecta"});
    }

    //Si todo ha ido correcto
    res.status(200).json({
        user: await encontrarUsuario.toUserResponse()
    });

});

//Acciones una vez autenticado --> Pasar por el middleware de autenticación

const getUserData= asyncHandler( async (req,res) => {
    // Recibimos el email y lo buscamos
    const email =req.email;

    const encontrarUsuario= await User.findOne( {email} ).exec();

    if(!encontrarUsuario){
        return res.status(404).json({message: "Email del Usuario no encontrado"});
    }

    res.status(200).json({
        user: await encontrarUsuario.toUserResponse()
    });

});

const updateUser= asyncHandler( async (req,res) => {
    //Confirmar que tenemos un objeto para actualizar valido
    const { username,email,password,image,bio }=req.body.user;

    if(!username && !email){
        return res.status(400).json({message: "No puedes dejar el email y el usuario vacio"});
    }

    //Si los datos para actualizar son validos
    const emailDecoded = req.email;

    const encontrarUsuario= await User.findOne( {email: emailDecoded} ).exec();

    if(!encontrarUsuario){
        return res.status(404).json({message: "No se puede actualizar un usuario que no existe"});
    }

    //Verificar que el nuevo email no esté en uso por otro usuario
    if(email && email !== emailDecoded){
        const emailExist = await User.findOne({ email: email });
        if(emailExist){
            return res.status(409).json({message: "El email ya está en uso por otro usuario"});
        }
        encontrarUsuario.email=email;
    }

    //Verificar que el nuevo username no esté en uso por otro usuario
    if(username && username !== encontrarUsuario.username){
        const usernameExist = await User.findOne({ username: username });
        if(usernameExist){
            return res.status(409).json({message: "El username ya está en uso por otro usuario"});
        }
        encontrarUsuario.username=username;
    }

    if(password){
        //Hashear la contraseña
        const hashedPassword= await argon2.hash(password);
        encontrarUsuario.password=hashedPassword;
    }

    if(typeof image !== 'undefined'){
        encontrarUsuario.image=image;
    }

    if(typeof bio !== 'undefined'){
        encontrarUsuario.bio=bio;
    }

    await encontrarUsuario.save();

    res.status(200).json({
        user: await encontrarUsuario.toUserResponse()
    });
});

const getDetailsUser= asyncHandler( async (req,res) => {
    const username=req.params.username;

    if(!username){
        return res.status(400).json({message: "No se ha especificado el username del usuario"});
    }

    const encontrarUsuario= await User.findOne( {username: username.toLowerCase()} ).exec();

    if(!encontrarUsuario){
        return res.status(404).json({message: "No se ha encontrado el usuario"});
    }

    res.status(200).json({
        user: await encontrarUsuario.toUserDetails()
    });
});

/////////////////////////////////////////////////////////77

const auth_controller = {
    registerUser: registerUser,
    loginUser: loginUser,
    getUserData: getUserData,
    updateUser: updateUser,
    getDetailsUser: getDetailsUser
};

module.exports = auth_controller;