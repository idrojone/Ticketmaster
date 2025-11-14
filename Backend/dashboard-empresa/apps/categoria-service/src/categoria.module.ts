import { Module } from '@nestjs/common';
import { CategoriaMerchandisingController } from './categoria.controller';
import { CategoriaMerchandisingService } from './categoria.service';
import { PrismaModule } from '@app/common';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriaMerchandisingController],
  providers: [CategoriaMerchandisingService],
})
export class CategoriaMerchandisingModule {}
