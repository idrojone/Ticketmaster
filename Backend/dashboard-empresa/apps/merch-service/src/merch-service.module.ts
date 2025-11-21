import { Module } from '@nestjs/common';
import { MerchServiceController } from './merch-service.controller';
import { MerchServiceService } from './merch-service.service';
import { PrismaModule } from 'libs/common/src/prisma';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'ssh_secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [MerchServiceController],
  providers: [MerchServiceService, JwtStrategy],
})
export class MerchServiceModule { }
