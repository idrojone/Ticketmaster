import { UserAdmin } from '@prisma/client';

/**
 * Usuario administrador con token de acceso
 * Excluye la contraseña por seguridad
 */
export interface UserAdminWithToken extends Omit<UserAdmin, 'password'> {
  accessToken: string;
  userType: 'admin';
}

/**
 * Tipo unión para cualquier usuario autenticado (solo admins)
 */
export type AuthenticatedUser = UserAdminWithToken;

/**
 * Respuesta de login
 */
export interface LoginResponse {
  user: AuthenticatedUser;
}

/**
 * Respuesta de registro
 */
export interface RegisterResponse {
  user: UserAdminWithToken;
}
