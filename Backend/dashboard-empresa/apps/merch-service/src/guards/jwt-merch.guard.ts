import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

function matchRoles(required: string[] | undefined, userRoles: string[] | undefined): boolean {
  if (!required || required.length === 0) return true;
  if (!userRoles || userRoles.length === 0) return false;
  return required.some(r => userRoles.includes(r));
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    if (!roles || roles.length === 0) {
      return true;
    }

    // Si es RPC (TCP), permitir acceso sin validación de roles
    // Las llamadas TCP son internas y confiables desde el API Gateway
    if (context.getType() === 'rpc') {
      return true;
    }

    // Para HTTP, validar roles normalmente
    const http = context.switchToHttp();
    const req = http.getRequest();
    const user = req?.user;

    if (!user) {
      // negar acceso si no hay usuario autenticado en HTTP
      return false;
    }

    return matchRoles(roles, user.role);
  }
}