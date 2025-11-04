import { UserAdmin } from "@prisma/client"
const S = require('fluent-json-schema')

const User = S.object()
    .prop('username', S.string().minLength(3).maxLength(30).required())
    .prop('email', S.string().format(S.FORMATS.EMAIL).required())
    .prop('bio', S.string())  
    .prop('image', S.string())
    .prop('accessToken', S.string())

const UserStatus = S.object()
    .prop('username', S.string().minLength(3).maxLength(30).required())
    .prop('status', S.boolean().required())




export interface LoginRequestBody {
    user: {
        username: string;
        password: string;
    }
}

export const login = {
    tags: ['Auth'],
    description: 'Autenticar usuario con credenciales',
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


export interface RegisterRequestBody {
    user: {
        username: string;
        email: string;
        password: string;
    }
}

export const  register = {
    tags: ['Auth'],
    description: 'Registrar un nuevo usuario',
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

export const get = {
    tags: ['Auth'],
    description: 'Obtener información del usuario por username',
    params: S.object()
        .prop('username', S.string().minLength(3).maxLength(30).required()),
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


/**
 *  Tipar accessToken
 */

export interface UserAdminWithToken extends Omit<UserAdmin, 'password'> {
    accessToken: string;
}
export type AuthenticatedUser = UserAdminWithToken;

export interface LoginResponse {
    user: AuthenticatedUser;
}

