import { Module } from '@nestjs/common';
import { MerchandiseController } from './merchandise/merchandise.controller';
import { MerchandiseService } from './merchandise/merchandise.service';
import { CategoryController } from './categories/category.controller';
import { CategoryService } from './categories/category.service';

@Module({
  controllers: [MerchandiseController, CategoryController],
  providers: [MerchandiseService, CategoryService],
})
export class MerchandiseModule {}
