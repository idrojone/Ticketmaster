import { Module } from '@nestjs/common';
import { CategoriaMerchandisingController } from './categoria.controller';
import { CategoriaMerchandisingService } from './categoria.service';
import { PrismaModule } from 'libs/common/src/prisma';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriaMerchandisingController],
  providers: [CategoriaMerchandisingService],
})
export class CategoriaMerchandisingModule {}
