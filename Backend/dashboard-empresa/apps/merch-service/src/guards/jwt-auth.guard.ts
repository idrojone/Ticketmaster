import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        // Detectar tipo de contexto
        const contextType = context.getType();

        // Si es RPC (TCP), permitir acceso sin JWT
        // Las llamadas TCP son internas desde el API Gateway
        if (contextType === 'rpc') {
            return true;
        }

        // Si es HTTP, aplicar validación JWT normal
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        // Para contextos RPC, no validar usuario
        if (context.getType() === 'rpc') {
            return true;
        }

        // Para HTTP, validar usuario y token
        if (err || !user) {
            throw err || new UnauthorizedException('Token invalido o expirado');
        }

        return user;
    }
}
