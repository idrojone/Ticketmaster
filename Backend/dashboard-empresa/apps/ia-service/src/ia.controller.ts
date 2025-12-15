import { Controller, Post, Body, Get } from '@nestjs/common';
import { IaService } from './ia.service';

@Controller('ia')
export class IaController {

  constructor(private readonly iaService: IaService) {}

  @Post('chat')
  async chat(@Body() body: { message: string }) {
    return this.iaService.processMessage(body.message);
  }

  @Get('health')
  async healthCheck() {
    return this.iaService.healthCheck();
  }
}
