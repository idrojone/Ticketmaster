import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class GatewayController {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy
  ) {}

  @Get()
  helloWorld() {
    return {
      message: '🚀 API Gateway - Hello World',
      status: 'running',
      port: 3030,
    };
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Get('auth/test')
  async testAuthService() {
    return this.authClient.send({ cmd: 'test' }, {});
  }

  @Post('auth/register')
  async register(@Body() registerDto: any) {
    return this.authClient.send({ cmd: 'register' }, registerDto);
  }

  @Post('auth/login')
  async login(@Body() loginDto: any) {
    return this.authClient.send({ cmd: 'login' }, loginDto);
  }
}
