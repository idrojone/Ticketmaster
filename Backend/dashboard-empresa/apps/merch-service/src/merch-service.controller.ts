import { Controller, Get, Post, Body } from '@nestjs/common';
import { MerchServiceService } from './merch-service.service';
import { CreateMerchandisingDto } from './dto';

@Controller()
export class MerchServiceController {
  constructor(private readonly merchServiceService: MerchServiceService) {}

  // @EventPattern('MerchFindAll')
  // findAll() {
  //   return this.merchServiceService.findAll();
  // }
  
  @Get('merchandising')
  findAll() {
    return this.merchServiceService.findAll();
  }

  @Post('merchandising')
  create(@Body() createDto: CreateMerchandisingDto) {
    return this.merchServiceService.create(createDto);
  }
}