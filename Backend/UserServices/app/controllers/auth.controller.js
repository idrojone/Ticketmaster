const User=require('../models/user.model');
const asyncHandler=require('express-async-handler');
const bcrypt=require('bcrypt');

const registerUser= asyncHandler( async (req,res) => {

    const { user }=req.body;

    //Se asegura de que todos los campos esten llenos
    if(!user || !user.username || !user.email || !user.password){
        return res.status(400).json({message: "Asegurese de tener todos los campos"});
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

const getUser= asyncHandler( async (req,res) => {

    

});

/////////////////////////////////////////////////////////77

const auth_controller = {
    registerUser: registerUser,
    loginUser: loginUser
};

module.exports = auth_controller;