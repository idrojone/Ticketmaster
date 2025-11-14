import { Status } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';

export class MerchandisingResponseDto {
  @ApiProperty({ example: 'merch-123', description: 'ID del merchandising' })
  id: string;

  @ApiProperty({ example: 'Camiseta Oficial', description: 'Nombre del merchandising' })
  nombre: string;

  @ApiProperty({ example: 'Descripción del merchandising', description: 'Descripción del merchandising' })
  descripcion: string | null;

  @ApiProperty({ example: 29.99, description: 'Precio del merchandising' })
  precio: number;

  @ApiProperty({ example: 100, description: 'Stock disponible del merchandising' })
  stock: number;

  @ApiProperty({ example: 'http://example.com/imagen.jpg', description: 'URL de la imagen del merchandising' })
  imagen: string | null;

  @ApiProperty({ example: 'cat-456', description: 'ID de la categoría del merchandising' })
  categoriaId: string;

  @ApiProperty({ example: "active", description: 'Estado del merchandising' })
  status: Status;

  @ApiProperty({ example: true, description: 'Indica si el merchandising está activo' })
  is_active: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Fecha de creación del merchandising' })
  createdAt: Date;
  
  @ApiProperty({ example: '2024-01-02T00:00:00.000Z', description: 'Fecha de última actualización del merchandising' })
  updatedAt: Date;
}
