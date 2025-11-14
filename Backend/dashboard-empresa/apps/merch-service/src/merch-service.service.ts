import { Injectable, Param } from '@nestjs/common';
import { PrismaService } from '@app/common';
import { CreateMerchandisingDto, MerchandisingResponseDto } from './dto';

@Injectable()
export class MerchServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(){
    console.log('findAll called');
    const merchandisings = await this.prisma.merchandising.findMany();
    return merchandisings;
  }

  async create(createDto: CreateMerchandisingDto){
    const newMerchandising = await this.prisma.merchandising.create({
      data: {
        nombre: createDto.nombre,
        descripcion: createDto.descripcion,
        precio: createDto.precio,
        stock: createDto.stock,
        imagen: createDto.imagen,
        categoriaId: createDto.categoriaId
      },
    });
    return newMerchandising;
  }
}


