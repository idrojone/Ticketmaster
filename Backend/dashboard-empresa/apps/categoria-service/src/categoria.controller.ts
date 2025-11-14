import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CategoriaMerchandisingService } from './categoria.service';
import { CreateCategoriaMerchandisingDto, UpdateCategoriaMerchandisingDto } from './dto';

@Controller('categories')
export class CategoriaMerchandisingController {
  constructor(private readonly categoriaMerchandisingService: CategoriaMerchandisingService) {}

  @Get()
  findAll() {
    return this.categoriaMerchandisingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaMerchandisingService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateCategoriaMerchandisingDto) {
    return this.categoriaMerchandisingService.create(createDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCategoriaMerchandisingDto) {
    return this.categoriaMerchandisingService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriaMerchandisingService.remove(id);
  }
}
