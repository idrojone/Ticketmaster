import { IsString, IsNumber, IsOptional, IsPositive, Min, IsBoolean, IsEnum } from 'class-validator';
import { Status } from '@app/common';

export class UpdateMerchandisingDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  precio?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsOptional()
  @IsString()
  categoriaId?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
