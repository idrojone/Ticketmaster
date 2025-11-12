import { Controller, Get } from '@nestjs/common';

@Controller()
export class GatewayController {
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
}
