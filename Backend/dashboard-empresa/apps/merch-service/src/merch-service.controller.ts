import { Controller, Get, Param, Post, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MerchServiceService } from './merch-service.service';
import {
  CreateMerchandisingDto,
  UpdateMerchandisingDto,
  MerchandisingResponseDto,
} from './dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { role } from './decorators/roles.decorator';
//GUARDS
import { RolesGuard } from './guards/jwt-merch.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


@ApiTags('Merchandising')
@Controller('merchandising')
export class MerchServiceController {
  constructor(private readonly merchService: MerchServiceService) { }

  @Get()
  @ApiCreatedResponse({ type: MerchandisingResponseDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @role('admin', 'empresa')
  async GetAllMerchandising(): Promise<MerchandisingResponseDto[]> {
    const result = await this.merchService.findAll();
    return plainToInstance(MerchandisingResponseDto, result);
  }

  @Get(':id')
  @ApiCreatedResponse({ type: MerchandisingResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Merchandising not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @role('admin', 'empresa')
  async GetMerchById(@Param('id') id: string): Promise<MerchandisingResponseDto> {
    const result = await this.merchService.findOne(id);
    return plainToInstance(MerchandisingResponseDto, result);
  }

  @Post()
  @ApiCreatedResponse({ type: MerchandisingResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @role('admin', 'empresa')
  async CreateMerchandising(@Body() createMerchandisingDto: CreateMerchandisingDto): Promise<MerchandisingResponseDto> {
    const result = await this.merchService.create(createMerchandisingDto);
    return plainToInstance(MerchandisingResponseDto, result);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: MerchandisingResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Merchandising not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @role('admin', 'empresa')
  async UpdateMerchandising(@Param('id') id: string, @Body() updateMerchandisingDto: UpdateMerchandisingDto): Promise<MerchandisingResponseDto> {
    const result = await this.merchService.update(id, updateMerchandisingDto);
    return plainToInstance(MerchandisingResponseDto, result);
  }

  @Delete(':id')
  @ApiCreatedResponse({ description: 'Merchandising deleted successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Merchandising not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @role('admin', 'empresa')
  async DeleteMerchandising(@Param('id') id: string): Promise<{ message: string }> {
    await this.merchService.remove(id);
    return { message: 'Merchandising deleted successfully' };
  }

  // TCP Microservice patterns
  @MessagePattern({ cmd: 'get-all-merchandising' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @role('admin', 'empresa')
  async handleGetAllMerchandising() {
    const result = await this.merchService.findAll();
    return plainToInstance(MerchandisingResponseDto, result);
  }

  @MessagePattern({ cmd: 'get-merch-by-id' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @role('admin', 'empresa')
  async handleGetMerchById(@Payload() data: { id: string }) {
    const result = await this.merchService.findOne(data.id);
    return plainToInstance(MerchandisingResponseDto, result);
  }

  @MessagePattern({ cmd: 'create-merchandising' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @role('admin', 'empresa')
  async handleCreateMerchandising(@Payload() createMerchandisingDto: CreateMerchandisingDto) {
    const result = await this.merchService.create(createMerchandisingDto);
    return plainToInstance(MerchandisingResponseDto, result);
  }

  @MessagePattern({ cmd: 'update-merchandising' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @role('admin', 'empresa')
  async handleUpdateMerchandising(@Payload() data: { id: string } & UpdateMerchandisingDto) {
    const { id, ...updateDto } = data;
    const result = await this.merchService.update(id, updateDto);
    return plainToInstance(MerchandisingResponseDto, result);
  }

  @MessagePattern({ cmd: 'delete-merchandising' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @role('admin', 'empresa')
  async handleDeleteMerchandising(@Payload() data: { id: string }) {
    await this.merchService.remove(data.id);
    return { message: 'Merchandising deleted successfully' };
  }
}