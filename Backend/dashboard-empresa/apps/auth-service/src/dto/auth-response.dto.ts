import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserWithTokenDto extends UserDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT de acceso' })
    accessToken: string;
}

export class AuthResponseDto {
    @ApiProperty({ type: () => UserWithTokenDto, description: 'Datos del usuario empresa con token' })
    user: UserWithTokenDto;
}
