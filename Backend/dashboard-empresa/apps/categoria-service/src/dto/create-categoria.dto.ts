import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaMerchandisingDto {
  @ApiProperty({ description: 'Nombre de la categoria' })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Descripcion de la categoria', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ description: 'URL de imagen de la categoria', required: false })
  @IsOptional()
  @IsString()
  imagen?: string;
}
