import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../libs/common/src/prisma/prisma.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  // Placeholder methods
  register(data: any) {
    return { message: 'Registering user', data };
  }

  login(data: any) {
    return { message: 'Logging in user', data };
  }

  logout() {
    return { message: 'User logged out' };
  }

  getProfile(userId: string) {
    return { message: 'Getting user profile', userId };
  }

  async findByEmail(email: string) {
    return this.prisma.userEmpresa.findFirst({ where: { email } });
  }
}
