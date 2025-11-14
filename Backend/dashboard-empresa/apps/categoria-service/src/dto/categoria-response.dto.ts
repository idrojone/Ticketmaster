import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@app/common';

export class CategoriaMerchandisingResponseDto {
  @ApiProperty({ description: 'ID unico de la categoria' })
  id: string;

  @ApiProperty({ description: 'Nombre de la categoria' })
  nombre: string;

  @ApiProperty({ description: 'Descripcion de la categoria', required: false })
  descripcion?: string;

  @ApiProperty({ description: 'URL de imagen de la categoria', required: false })
  imagen?: string;

  @ApiProperty({ description: 'Estado de la categoria' })
  status: Status;

  @ApiProperty({ description: 'Indica si la categoria esta activa' })
  is_active: boolean;

  @ApiProperty({ description: 'Fecha de creacion' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de ultima actualizacion' })
  updatedAt: Date;
}
