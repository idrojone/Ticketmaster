import { Module } from '@nestjs/common';
import { MerchServiceController } from './merch-service.controller';
import { MerchServiceService } from './merch-service.service';
import { MerchServiceAxiosController } from './merch-service.axios.controller'
import { PrismaModule } from 'libs/common/src/prisma';
import { MerchAxiosService } from './merch-service.axios.service';


@Module({
  imports: [PrismaModule],
  controllers: [MerchServiceController, MerchServiceAxiosController],
  providers: [MerchServiceService, MerchAxiosService],
})
export class MerchServiceModule {}
