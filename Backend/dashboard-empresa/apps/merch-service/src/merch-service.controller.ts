import {Controller,Get,Param,Post,Body,Patch,} from '@nestjs/common';
import { ApiTags,ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { MerchServiceService } from './merch-service.service';
import {
  CreateMerchandisingDto,
  UpdateMerchandisingDto,
  MerchandisingResponseDto,
} from './dto';
import { plainToClass, plainToInstance } from 'class-transformer';

@ApiTags('Merchandising')
@Controller('merchandising')
export class MerchServiceController {
  constructor(private readonly merchService: MerchServiceService) {}

    @Get()
    @ApiCreatedResponse({ type: MerchandisingResponseDto, isArray: true })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    GetAllMerchandising(): MerchandisingResponseDto[] {
      return plainToInstance(MerchandisingResponseDto, this.GetAllMerchandising())
    }

    @Get(':id')
    @ApiCreatedResponse({ type: MerchandisingResponseDto })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    @ApiNotFoundResponse({ description: 'Merchandising not found' })
    GetMerchById(@Param('id') id: string): MerchandisingResponseDto {
      return plainToInstance(MerchandisingResponseDto, this.merchService.findOne(id));
    }

    @Post()
    @ApiCreatedResponse({ type: MerchandisingResponseDto })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    CreateMerchandising(@Body() createMerchandisingDto: CreateMerchandisingDto): MerchandisingResponseDto {
      return plainToInstance(MerchandisingResponseDto, this.merchService.create(createMerchandisingDto));
    }

    @Patch(':id')
    @ApiCreatedResponse({ type: MerchandisingResponseDto })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    @ApiNotFoundResponse({ description: 'Merchandising not found' })
    UpdateMerchandising(@Param('id') id: string, @Body() updateMerchandisingDto: UpdateMerchandisingDto): MerchandisingResponseDto {
      return plainToInstance(MerchandisingResponseDto, this.merchService.update(id, updateMerchandisingDto));
    }
}