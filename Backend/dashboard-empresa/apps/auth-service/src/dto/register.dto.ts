import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
	@ApiProperty({ example: 'mi_empresa', description: 'Nombre de usuario' })
	@IsString()
	username: string;

	@ApiProperty({ example: 'empresa@example.com', description: 'Email de la empresa' })
	@IsEmail()
	email: string;

	@ApiProperty({ example: 'Str0ngP@ss!', description: 'Contraseña de registro' })
	@IsString()
	password: string;

	@ApiPropertyOptional({ example: 'Somos una promotora de eventos', description: 'Biografía de la empresa' })
	@IsOptional()
	@IsString()
	bio?: string;

	@ApiPropertyOptional({ example: 'https://cdn.example.com/logo.png', description: 'URL de la imagen/logo' })
	@IsOptional()
	@IsString()
	image?: string;
}
