const S = require('fluent-json-schema')

const User = S.object()
    .prop('username', S.string().minLength(3).maxLength(30).required())
    .prop('email', S.string().format(S.FORMATS.EMAIL).required())
    .prop('password', S.string().minLength(6).required())
    .prop('bio', S.string())  
    .prop('accessToken', S.string())
    .prop('followedBy', S.array().items(S.string()))
    .prop('follows', S.array().items(S.string()))
    .prop('likedConciertos', S.array().items(S.string()))
    .prop('entradas', S.array().items(S.string()))
    .prop('comentarios', S.array().items(S.string()))
    .prop('is_active', S.boolean().required())

const UserStatus = S.object()
    .prop('username', S.string().minLength(3).maxLength(30).required())
    .prop('status', S.boolean().required())



export const login = {
    body: S.object()
        .id('http://api/users/login')
        .title('Login de usuario')
        .description('Login del usuario y respuesta con token')
        .prop(
            'user',
            S.object()
                .prop('username', S.string().required())
                .prop('password', S.string().required())
        ).required(),

    response: {
        200: S.object().prop('user', User),
        401: S.object().prop('message', S.string())
    }
}

export const  register = {
    body: S.object()
        .id('http://api/users/register')
        .title('Registro de usuario')
        .description('Registro de un nuevo usuario')
        .prop(
            'user',
            S.object()
                .prop('username', S.string().required())
                .prop('email', S.string().required())
                .prop('password', S.string().required())
        ).required(),

    response: {
        200: S.object().prop('user', User),
        400: S.object().prop('message', S.string())
    }
}

const get = {
    response: {
        200: S.object().prop('user', User),
        404: S.object().prop('message', S.string())
    }
}

const update = {
    body: S.object()
        .id('http://api/user')
        .title('Actualización de usuario')
        .description('Actualizar información del usuario')
        .prop(
            'user',
            S.object()
                .prop('email', S.string())
                .prop('username', S.string())
                .prop('password', S.string())
                .prop('bio', S.string())
                .prop('image', S.string())
        ).required(),
    
    response: {
        200: S.object().prop('user', User),
        404: S.object().prop('message', S.string())
    }
}

const getStatus = {
    response: {
        200: S.object().prop('user', UserStatus),
        404: S.object().prop('message', S.string())
    }
}

const updateStatus = {
    body: S.object()
        .id('http://api/user/status')
        .title('Actualización de estado de usuario')
        .description('Actualizar estado activo/inactivo del usuario')
        .prop('user', UserStatus).required(),

    response: {
        200: S.object().prop('user', UserStatus),
        404: S.object().prop('message', S.string())
    }
}

