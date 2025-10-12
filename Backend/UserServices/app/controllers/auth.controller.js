const User=require('../models/user.model');
const asyncHandler=require('express-async-handler');
const bcrypt=require('bcrypt');
const e = require('express');

const registerUser= asyncHandler( async (req,res) => {

    const { user }=req.body;

    //Se asegura de que todos los campos esten llenos
    if(!user || !user.username || !user.email || !user.password){
        return res.status(400).json({message: "Asegurese de tener todos los campos"});
    }

    //Asegura que el email no este en uso
    const emailExist= await User.findOne( { $or: [ { email: user.email },{ username: user.username } ] } );
    if(emailExist){
        return res.status(409).json({message: "El email o el usuario ya estan en uso"});
    }

    //Hashear la contraseña
    const hashedPassword= await bcrypt.hash(user.password,10);

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
            user: crearUsuario.toUserResponse(),
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
    const match=await bcrypt.compare(user.password, encontrarUsuario.password);

    if(!match){
        return res.status(401).json({message: "Contraseña incorrecta"});
    }

    //Si todo ha ido correcto
    res.status(200).json({
        user: encontrarUsuario.toUserResponse()
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
        user: encontrarUsuario.toUserResponse()
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

    if(email){
        encontrarUsuario.email=email;
    }

    if(username){
        encontrarUsuario.username=username;
    }

    if(password){
        //Hashear la contraseña
        const hashedPassword= await bcrypt.hash(password,10);
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
        user: encontrarUsuario.toUserResponse()
    });
});

/////////////////////////////////////////////////////////77

const auth_controller = {
    registerUser: registerUser,
    loginUser: loginUser,
    getUserData: getUserData,
    updateUser: updateUser
};

module.exports = auth_controller;