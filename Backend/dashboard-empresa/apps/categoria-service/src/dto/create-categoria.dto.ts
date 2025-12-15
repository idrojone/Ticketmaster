import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaMerchandisingDto {
  @ApiProperty({ example: 'Ropa', description: 'Nombre de la categoría' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Categoría de ropa y vestimenta', description: 'Descripción de la categoría', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 'https://example.com/imagen.jpg', description: 'URL de imagen de la categoría', required: false })
  @IsOptional()
  @IsString()
  imagen?: string;
}
