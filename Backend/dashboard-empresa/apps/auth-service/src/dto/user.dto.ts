import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'mi_empresa', description: 'Nombre de usuario' })
  username: string;

  @ApiProperty({ example: 'empresa@example.com', description: 'Email de la empresa' })
  email: string;

  @ApiPropertyOptional({ example: 'Somos una promotora', description: 'Biografía' })
  bio?: string | null;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logo.png', description: 'URL de imagen/logo' })
  image?: string | null;
}
