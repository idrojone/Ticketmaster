import { Module } from '@nestjs/common';
import { MerchServiceController } from './merch-service.controller';
import { MerchServiceService } from './merch-service.service';
import { PrismaModule } from 'libs/common/src/prisma';


@Module({
  imports: [PrismaModule],
  controllers: [MerchServiceController],
  providers: [MerchServiceService],
})
export class MerchServiceModule {}
