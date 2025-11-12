import { Injectable } from '@nestjs/common';

@Injectable()
export class MerchandiseService {
  findAll() {
    return { items: [] };
  }

  create(data: any) {
    return { message: 'Merchandise created', data };
  }

  findOne(id: string) {
    return { id, message: 'Merchandise found' };
  }

  update(id: string, data: any) {
    return { id, message: 'Merchandise updated', data };
  }

  delete(id: string) {
    return { id, message: 'Merchandise deleted' };
  }
}
