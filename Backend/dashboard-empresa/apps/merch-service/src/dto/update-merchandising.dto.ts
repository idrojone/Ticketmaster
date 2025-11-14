import { IsString, IsNumber, IsOptional, IsPositive, Min, IsBoolean, IsIn } from 'class-validator';
import { Status } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMerchandisingDto {
  @ApiProperty({ example: 'Camiseta Oficial', description: 'Nombre del merchandising' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({ example: 'Descripción del merchandising', description: 'Descripción del merchandising' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 29.99, description: 'Precio del merchandising' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  precio?: number;

  @ApiProperty({ example: 100, description: 'Stock del merchandising' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Imagen del merchandising' })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiProperty({ example: 'categoria-123', description: 'ID de la categoría del merchandising' })
  @IsOptional()
  @IsString()
  categoriaId?: string;

  @ApiProperty({ example: "PENDING", description: 'Estado del merchandising' })
  @IsOptional()
  @IsIn(['PENDING', 'ACCEPTED', 'REJECTED'])
  status?: Status;

  @ApiProperty({ example: true, description: 'Indica si el merchandising está activo' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
