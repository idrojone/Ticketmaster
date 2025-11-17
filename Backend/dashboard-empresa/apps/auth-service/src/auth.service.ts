import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { RegisterDto, LoginDto } from './dto';
import { PrismaService } from '@lib/common/';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const { username, email, password, bio, image } = data;

    const existing = await this.prisma.userEmpresa.findFirst({
      where: { email },
    });
    if (existing) throw new BadRequestException('El email ya esta en uso');

    const hashed = await argon2.hash(password);

    const user = await this.prisma.userEmpresa.create({
      data: {
        username,
        email,
        password: hashed,
        bio,
        image,
      },
    });

    const accessToken= await this.generateAccessToken(user.username, user.email);

    return { user: { username: user.username, email: user.email, bio: user.bio, image: user.image, accessToken }};
  }

  async login(data: LoginDto) {
    const { email, password } = data;
    const user = await this.prisma.userEmpresa.findFirst({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciales invalidas');

    const valid = await argon2.verify(user.password, password);
    if (!valid) throw new UnauthorizedException('Credenciales invalidas');

    const accessToken= await this.generateAccessToken(user.username, user.email);

    return { user: { username: user.username, email: user.email, bio: user.bio, image: user.image, accessToken }};
  }

  async getProfile(email: string) {
    const user = await this.prisma.userEmpresa.findFirst({ where: { email } });
    if (!user) throw new UnauthorizedException('User not found');
    return { username: user.username, email: user.email, bio: user.bio, image: user.image };
  }

  async findByEmail(email: string) {
    const empresa = await this.prisma.userEmpresa.findFirst({ where: { email } });
    if (!empresa) throw new BadRequestException('Empresa no encontrada');
    return { username: empresa.username, email: empresa.email, bio: empresa.bio, image: empresa.image };
  }

  private async generateAccessToken(username: string, email: string): Promise<string> {
    const payload = { role: 'empresa', username, email };
    return this.jwtService.signAsync(payload);
  }
}
