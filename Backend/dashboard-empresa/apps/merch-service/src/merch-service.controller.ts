import {Controller,Get,Param,Post,Body,Patch,} from '@nestjs/common';
import { ApiTags,ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MerchServiceService } from './merch-service.service';
import {
  CreateMerchandisingDto,
  UpdateMerchandisingDto,
  MerchandisingResponseDto,
} from './dto';
import { plainToClass, plainToInstance } from 'class-transformer';

@ApiTags('Merchandising')
@Controller('merchandising')
export class MerchServiceController {
  constructor(private readonly merchService: MerchServiceService) {}

    @Get()
    @ApiCreatedResponse({ type: MerchandisingResponseDto, isArray: true })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    async GetAllMerchandising(): Promise<MerchandisingResponseDto[]> {
      const result = await this.merchService.findAll();
      return plainToInstance(MerchandisingResponseDto, result);
    }

    @Get(':id')
    @ApiCreatedResponse({ type: MerchandisingResponseDto })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    @ApiNotFoundResponse({ description: 'Merchandising not found' })
    async GetMerchById(@Param('id') id: string): Promise<MerchandisingResponseDto> {
      const result = await this.merchService.findOne(id);
      return plainToInstance(MerchandisingResponseDto, result);
    }

    @Post()
    @ApiCreatedResponse({ type: MerchandisingResponseDto })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    async CreateMerchandising(@Body() createMerchandisingDto: CreateMerchandisingDto): Promise<MerchandisingResponseDto> {
      const result = await this.merchService.create(createMerchandisingDto);
      return plainToInstance(MerchandisingResponseDto, result);
    }

    @Patch(':id')
    @ApiCreatedResponse({ type: MerchandisingResponseDto })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    @ApiNotFoundResponse({ description: 'Merchandising not found' })
    async UpdateMerchandising(@Param('id') id: string, @Body() updateMerchandisingDto: UpdateMerchandisingDto): Promise<MerchandisingResponseDto> {
      const result = await this.merchService.update(id, updateMerchandisingDto);
      return plainToInstance(MerchandisingResponseDto, result);
    }

    // TCP Microservice patterns
    @MessagePattern({ cmd: 'get-all-merchandising' })
    async handleGetAllMerchandising() {
      const result = await this.merchService.findAll();
      return plainToInstance(MerchandisingResponseDto, result);
    }

    @MessagePattern({ cmd: 'get-merch-by-id' })
    async handleGetMerchById(@Payload() data: { id: string }) {
      const result = await this.merchService.findOne(data.id);
      return plainToInstance(MerchandisingResponseDto, result);
    }

    @MessagePattern({ cmd: 'create-merchandising' })
    async handleCreateMerchandising(@Payload() createMerchandisingDto: CreateMerchandisingDto) {
      const result = await this.merchService.create(createMerchandisingDto);
      return plainToInstance(MerchandisingResponseDto, result);
    }

    @MessagePattern({ cmd: 'update-merchandising' })
    async handleUpdateMerchandising(@Payload() data: { id: string } & UpdateMerchandisingDto) {
      const { id, ...updateDto } = data;
      const result = await this.merchService.update(id, updateDto);
      return plainToInstance(MerchandisingResponseDto, result);
    }
}