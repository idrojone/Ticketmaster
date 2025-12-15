import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriaMerchandisingService } from './categoria.service';
import { CreateCategoriaMerchandisingDto, UpdateCategoriaMerchandisingDto, CategoriaMerchandisingResponseDto } from './dto';

@ApiTags('Categorias Merchandising')
@Controller('categories')
export class CategoriaMerchandisingController {
  constructor(private readonly categoriaMerchandisingService: CategoriaMerchandisingService) {}

  @Get()
  @ApiOkResponse({ type: CategoriaMerchandisingResponseDto, isArray: true, description: 'Lista de todas las categorias' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  findAll(): Promise<CategoriaMerchandisingResponseDto[]> {
    return this.categoriaMerchandisingService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: CategoriaMerchandisingResponseDto, description: 'Categoria encontrada' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Categoria no encontrada' })
  findOne(@Param('id') id: string): Promise<CategoriaMerchandisingResponseDto | null> {
    return this.categoriaMerchandisingService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: CategoriaMerchandisingResponseDto, description: 'Categoria creada exitosamente' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  create(@Body() createDto: CreateCategoriaMerchandisingDto): Promise<CategoriaMerchandisingResponseDto> {
    return this.categoriaMerchandisingService.create(createDto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: CategoriaMerchandisingResponseDto, description: 'Categoria actualizada exitosamente' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Categoria no encontrada' })
  update(@Param('id') id: string, @Body() updateDto: UpdateCategoriaMerchandisingDto): Promise<CategoriaMerchandisingResponseDto | null> {
    return this.categoriaMerchandisingService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: CategoriaMerchandisingResponseDto, description: 'Categoria eliminada exitosamente' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Categoria no encontrada' })
  remove(@Param('id') id: string): Promise<CategoriaMerchandisingResponseDto | null> {
    return this.categoriaMerchandisingService.remove(id);
  }

  // TCP Microservice patterns
  @MessagePattern({ cmd: 'get-all-categories' })
  async handleGetAllCategories() {
    return this.categoriaMerchandisingService.findAll();
  }

  @MessagePattern({ cmd: 'get-category-by-id' })
  async handleGetCategoryById(@Payload() data: { id: string }) {
    return this.categoriaMerchandisingService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'create-category' })
  async handleCreateCategory(@Payload() createDto: CreateCategoriaMerchandisingDto) {
    return this.categoriaMerchandisingService.create(createDto);
  }

  @MessagePattern({ cmd: 'update-category' })
  async handleUpdateCategory(@Payload() data: { id: string } & UpdateCategoriaMerchandisingDto) {
    const { id, ...updateDto } = data;
    return this.categoriaMerchandisingService.update(id, updateDto);
  }

  @MessagePattern({ cmd: 'delete-category' })
  async handleDeleteCategory(@Payload() data: { id: string }) {
    return this.categoriaMerchandisingService.remove(data.id);
  }
}
