import { IsString, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateMerchandisingDto {
  @ApiProperty({ example: 'Camiseta Oficial', description: 'Nombre del merchandising' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Descripción del merchandising', description: 'Descripción del merchandising' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 29.99, description: 'Precio del merchandising' })
  @IsNumber()
  @IsPositive()
  precio: number;

  @ApiProperty({ example: 100, description: 'Stock del merchandising' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Imagen del merchandising' })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiProperty({ example: 'categoria-123', description: 'ID de la categoría del merchandising' })
  @IsString()
  categoriaId: string;
}