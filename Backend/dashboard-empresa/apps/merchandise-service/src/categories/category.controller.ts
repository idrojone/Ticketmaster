import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    return { message: 'Listing categories' };
  }

  @Post()
  create(@Body() body: any) {
    return { message: 'Creating category', data: body };
  }
}
