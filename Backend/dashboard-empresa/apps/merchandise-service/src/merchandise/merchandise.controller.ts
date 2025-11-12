import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { MerchandiseService } from './merchandise.service';

@Controller('merchandise')
export class MerchandiseController {
  constructor(private readonly merchandiseService: MerchandiseService) {}

  @Get()
  findAll() {
    return { message: '🛍️  Listing merchandise' };
  }

  @Post()
  create(@Body() body: any) {
    return { message: 'Creating merchandise', data: body };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { message: 'Getting merchandise', id };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return { message: 'Updating merchandise', id, data: body };
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return { message: 'Deleting merchandise', id };
  }
}
