import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from '../../../../libs/common/src/prisma/prisma.service';
import { JwtPayload } from '../../../../libs/common/src/jwt/jwt.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'ssh_secret',
    });
  }

  async validate(payload: JwtPayload) {

    if (payload.rol !== 'empresa') {
      throw new UnauthorizedException('Acceso denegado');
    }

    const { username } = payload;
    const user = await this.prisma.userEmpresa.findUnique({ where: { username } });
    if (!user) return null;
    return { username: user.username, email: user.email, rol: payload.rol };
  }
}
