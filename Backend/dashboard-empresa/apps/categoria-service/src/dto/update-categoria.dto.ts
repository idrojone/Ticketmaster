import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { Status } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoriaMerchandisingDto {
  @ApiProperty({ description: 'Nombre de la categoria', required: false })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({ description: 'Descripcion de la categoria', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ description: 'URL de imagen de la categoria', required: false })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiProperty({ example: 'ACCEPTED', description: 'Estado de la categoría' })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
  
  @ApiProperty({ example: true, description: 'Indica si la categoría está activa' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
