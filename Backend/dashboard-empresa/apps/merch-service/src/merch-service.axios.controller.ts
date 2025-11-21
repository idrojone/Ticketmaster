import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';
import { MerchAxiosService } from './merch-service.axios.service';

@ApiTags('Merchandising')
@Controller('merchAxios')
export class MerchServiceAxiosController {
    constructor(private readonly merchService: MerchAxiosService) {}

    @Get('random-id')
    async GetOneRandom(): Promise<string> {
        const result = await this.merchService.findOneRandom();
        return result;
    }

    @MessagePattern({ cmd: 'merch-random' })
    async handleMercRandom() {
        const result = await this.merchService.findOneRandom();
        return result;
    }
}