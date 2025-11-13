import { Status } from '@app/common';

export class MerchandisingResponseDto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  imagen?: string;
  categoriaId: string;
  status: Status;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
