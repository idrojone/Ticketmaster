import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common';
import {
  CreateMerchandisingDto,
  MerchandisingResponseDto,
  UpdateMerchandisingDto,
} from './dto';

@Injectable()
export class MerchServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<MerchandisingResponseDto[]> {
    const merchandisings = await this.prisma.merchandising.findMany();
    return merchandisings;
  }

  async findOne(id: string): Promise<MerchandisingResponseDto | null> {
    return this.prisma.merchandising.findUnique({
      where: { id },
    });
  }

  async create(
    createDto: CreateMerchandisingDto,
  ): Promise<MerchandisingResponseDto> {
    const newMerchandising = await this.prisma.merchandising.create({
      data: {
        nombre: createDto.nombre,
        descripcion: createDto.descripcion,
        precio: createDto.precio,
        stock: createDto.stock,
        imagen: createDto.imagen,
        categoriaId: createDto.categoriaId,
      },
    });
    return newMerchandising;
  }

  async update(
    id: string,
    updateDto: UpdateMerchandisingDto,
  ): Promise<MerchandisingResponseDto | null> {
    return this.prisma.merchandising.update({
      where: { id },
      data: {
        nombre: updateDto.nombre,
        descripcion: updateDto.descripcion,
        precio: updateDto.precio,
        stock: updateDto.stock,
        imagen: updateDto.imagen,
        categoriaId: updateDto.categoriaId,
        status: updateDto.status,
        is_active: updateDto.is_active,
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.merchandising.delete({
      where: { id },
    });
  }
}


