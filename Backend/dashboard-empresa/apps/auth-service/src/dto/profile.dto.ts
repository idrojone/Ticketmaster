import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProfileDto {
  @ApiPropertyOptional({ example: 'mi_empresa_renovada', description: 'Nuevo nombre de usuario' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @ApiPropertyOptional({ example: 'nuevo-email@example.com', description: 'Nuevo email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Nueva bio', description: 'Biografía actualizada' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/nuevo-logo.png', description: 'URL nueva de imagen/logo' })
  @IsOptional()
  @IsString()
  image?: string;
}
