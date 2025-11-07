import { UserAdmin } from "@prisma/client";
import S = require('fluent-json-schema');
const Schema: any = S;

const User = Schema.object()
    .prop('username', Schema.string().minLength(3).maxLength(30).required())
    .prop('email', Schema.string().format(Schema.FORMATS.EMAIL).required())
    .prop('bio', Schema.string())  
    .prop('image', Schema.string())
    .prop('accessToken', Schema.string());

const UserStatus = Schema.object()
    .prop('username', Schema.string().minLength(3).maxLength(30).required())
    .prop('status', Schema.boolean().required());




export interface LoginRequestBody {
    user: {
        email: string;
        password: string;
    }
}

export const login = {
    tags: ['Auth'],
    description: 'Autenticar usuario con credenciales',
    body: Schema.object()
        .id('http://api/users/login')
        .title('Login de usuario')
        .description('Login del usuario y respuesta con token')
        .prop(
            'user',
            Schema.object()
                .prop('email', Schema.string().required())
                .prop('password', Schema.string().required())
        ).required(),

    response: {
    200: Schema.object().prop('user', User),
    401: Schema.object().prop('message', Schema.string())
    }
};


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
    body: Schema.object()
        .id('http://api/users/register')
        .title('Registro de usuario')
        .description('Registro de un nuevo usuario')
        .prop(
            'user',
            Schema.object()
                .prop('username', Schema.string().required())
                .prop('email', Schema.string().required())
                .prop('password', Schema.string().required())
        ).required(),

    response: {
    200: Schema.object().prop('user', User),
    400: Schema.object().prop('message', Schema.string())
    }
};

export const get = {
    tags: ['Auth'],
    description: 'Obtener información del usuario por username',
    params: Schema.object()
        .prop('username', Schema.string().minLength(3).maxLength(30).required()),
    response: {
    200: Schema.object().prop('user', User),
    404: Schema.object().prop('message', Schema.string())
    }
};

export const update = {
    body: Schema.object()
        .id('http://api/user')
        .title('Actualización de usuario')
        .description('Actualizar información del usuario')
        .prop(
            'user',
            Schema.object()
                .prop('email', Schema.string())
                .prop('username', Schema.string())
                .prop('password', Schema.string())
                .prop('bio', Schema.string())
                .prop('image', Schema.string())
        ).required(),
    
    response: {
        200: Schema.object().prop('user', User),
        404: Schema.object().prop('message', Schema.string())
    }
};

export const getStatus = {
    response: {
        200: Schema.object().prop('user', UserStatus),
        404: Schema.object().prop('message', Schema.string())
    }
};

export const updateStatus = {
    body: Schema.object()
        .id('http://api/user/status')
        .title('Actualización de estado de usuario')
        .description('Actualizar estado activo/inactivo del usuario')
        .prop('user', UserStatus).required(),

    response: {
    200: Schema.object().prop('user', UserStatus),
    404: Schema.object().prop('message', Schema.string())
    }
};


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

