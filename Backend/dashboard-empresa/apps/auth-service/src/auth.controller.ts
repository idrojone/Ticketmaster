import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  helloWorld() {
    return {
      message: '🔐 Auth Service - Hello World',
      status: 'running',
      port: 3031,
    };
  }

  @Post('register')
  register(@Body() body: any) {
    return { message: 'Register endpoint', data: body };
  }

  @Post('login')
  login(@Body() body: any) {
    return { message: 'Login endpoint', data: body };
  }

  @Post('logout')
  logout() {
    return { message: 'Logout endpoint' };
  }

  @Get('profile')
  getProfile() {
    return { message: 'Get profile endpoint' };
  }
}
