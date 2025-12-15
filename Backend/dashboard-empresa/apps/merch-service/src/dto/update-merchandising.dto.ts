import { IsString, IsNumber, IsOptional, IsPositive, Min, IsBoolean, IsEnum } from 'class-validator';
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

  @ApiProperty({ example: "PENDING|ACCEPTED|REJECTED|CANCELLED", description: 'Estado del merchandising' })
  @IsOptional()
  @IsString()
  status?: string;
  
  @ApiProperty({ example: true, description: 'Indica si el merchandising está activo' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
