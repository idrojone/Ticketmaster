import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  findAll() {
    return { items: [] };
  }

  create(data: any) {
    return { message: 'Category created', data };
  }
}
