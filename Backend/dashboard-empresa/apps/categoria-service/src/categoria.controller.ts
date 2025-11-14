import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { CategoriaMerchandisingService } from './categoria.service';
import { CreateCategoriaMerchandisingDto, UpdateCategoriaMerchandisingDto, CategoriaMerchandisingResponseDto } from './dto';

@ApiTags('Categorías Merchandising')
@Controller('categories')
export class CategoriaMerchandisingController {
  constructor(private readonly categoriaMerchandisingService: CategoriaMerchandisingService) {}

  @Get()
  @ApiOkResponse({ type: CategoriaMerchandisingResponseDto, isArray: true, description: 'Lista de todas las categorías' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  findAll(): Promise<CategoriaMerchandisingResponseDto[]> {
    return this.categoriaMerchandisingService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: CategoriaMerchandisingResponseDto, description: 'Categoría encontrada' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Categoría no encontrada' })
  findOne(@Param('id') id: string): Promise<CategoriaMerchandisingResponseDto> {
    return this.categoriaMerchandisingService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: CategoriaMerchandisingResponseDto, description: 'Categoría creada exitosamente' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  create(@Body() createDto: CreateCategoriaMerchandisingDto): Promise<CategoriaMerchandisingResponseDto> {
    return this.categoriaMerchandisingService.create(createDto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: CategoriaMerchandisingResponseDto, description: 'Categoría actualizada exitosamente' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Categoría no encontrada' })
  update(@Param('id') id: string, @Body() updateDto: UpdateCategoriaMerchandisingDto): Promise<CategoriaMerchandisingResponseDto> {
    return this.categoriaMerchandisingService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: CategoriaMerchandisingResponseDto, description: 'Categoría eliminada exitosamente' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Categoría no encontrada' })
  remove(@Param('id') id: string): Promise<CategoriaMerchandisingResponseDto> {
    return this.categoriaMerchandisingService.remove(id);
  }
}
