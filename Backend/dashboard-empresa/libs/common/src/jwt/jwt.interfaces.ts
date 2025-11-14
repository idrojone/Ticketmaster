export interface JwtPayload {
  rol: 'empresa';
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}

export interface TokensDto {
  accessToken: string;
}

export interface RefreshTokenPayload {
  username: string;
}
