import { Injectable } from '@nestjs/common';
import { PrismaService, Status } from 'libs/common/src/prisma';

import {
  CreateMerchandisingDto,
  MerchandisingResponseDto,
  UpdateMerchandisingDto,
} from './dto';

@Injectable()
export class MerchServiceService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(): Promise<MerchandisingResponseDto[]> {
    const merchandisings = await this.prisma.merchandising.findMany();
    if (!merchandisings) {
      return [];
    }
    return merchandisings;
  }

  async findOne(id: string): Promise<MerchandisingResponseDto | null> {
    const merchandising = this.prisma.merchandising.findUnique({
      where: { id },
    });
    if (!merchandising) {
      return null;
    }
    return merchandising;
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
        ...(updateDto.nombre !== undefined && { nombre: updateDto.nombre }),
        ...(updateDto.descripcion !== undefined && { descripcion: updateDto.descripcion }),
        ...(updateDto.precio !== undefined && { precio: updateDto.precio }),
        ...(updateDto.stock !== undefined && { stock: updateDto.stock }),
        ...(updateDto.imagen !== undefined && { imagen: updateDto.imagen }),
        ...(updateDto.categoriaId !== undefined && { categoria: { connect: { id: updateDto.categoriaId } } }),
        ...(updateDto.status !== undefined && { status: updateDto.status as Status }),
        ...(updateDto.is_active !== undefined && { is_active: updateDto.is_active }),
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.merchandising.delete({
      where: { id },
    });
  }
}


