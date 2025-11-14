import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@app/common';

export class CategoriaMerchandisingResponseDto {
  @ApiProperty({ example: 'cat-123', description: 'ID único de la categoría' })
  id: string;

  @ApiProperty({ example: 'Ropa', description: 'Nombre de la categoría' })
  nombre: string;

  @ApiProperty({ example: 'Categoría de ropa y vestimenta', description: 'Descripción de la categoría' })
  descripcion: string | null;

  @ApiProperty({ example: 'https://example.com/imagen.jpg', description: 'URL de imagen de la categoría' })
  imagen: string | null;

  @ApiProperty({ example: 'ACCEPTED', description: 'Estado de la categoría' })
  status: Status;

  @ApiProperty({ example: true, description: 'Indica si la categoría está activa' })
  is_active: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-02T00:00:00.000Z', description: 'Fecha de última actualización' })
  updatedAt: Date;
}
