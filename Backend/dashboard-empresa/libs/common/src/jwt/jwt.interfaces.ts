export interface JwtPayload {
  sub: string; // user id
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface TokensDto {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number; // seconds until expiry
}

export interface RefreshTokenPayload {
  sub: string;
  tokenId?: string;
}
