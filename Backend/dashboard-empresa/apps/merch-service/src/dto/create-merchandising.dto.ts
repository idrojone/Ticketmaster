import { IsString, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';


export class CreateMerchandisingDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  @IsPositive()
  precio: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsString()
  categoriaId: string;
}