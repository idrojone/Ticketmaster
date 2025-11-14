import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import type { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registro de usuario empresa' })
  @ApiCreatedResponse({ description: 'Usuario registrado y token devuelto', type: AuthResponseDto })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login de usuario empresa' })
  @ApiOkResponse({ description: 'Login correcto y token devuelto', type: AuthResponseDto })
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Perfil del usuario autenticado' })
  getProfile(@Req() req: Request) {
    return this.authService.getProfile((req as any).user.email);
  }

  @Get('empresa/:email')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener empresa por email (protegido)' })
  getEmpresa(@Req() req: Request) {
    const email = (req as any).params?.email;
    return this.authService.findByEmail(email);
  }
}
