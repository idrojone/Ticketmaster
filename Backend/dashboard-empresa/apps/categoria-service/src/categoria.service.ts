import { Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/common/src/prisma';

import {
  CreateCategoriaMerchandisingDto,
  UpdateCategoriaMerchandisingDto,
  CategoriaMerchandisingResponseDto,
} from './dto';

@Injectable()
export class CategoriaMerchandisingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CategoriaMerchandisingResponseDto[]> {
    const categorias = await this.prisma.categoriaMerchandising.findMany();
    return categorias;
  }

  async findOne(id: string): Promise<CategoriaMerchandisingResponseDto | null> {
    return this.prisma.categoriaMerchandising.findUnique({
      where: { id },
    });
  }

  async create(
    createDto: CreateCategoriaMerchandisingDto,
  ): Promise<CategoriaMerchandisingResponseDto> {
    const newCategoria = await this.prisma.categoriaMerchandising.create({
      data: {
        nombre: createDto.nombre,
        descripcion: createDto.descripcion,
        imagen: createDto.imagen,
      },
    });
    return newCategoria;
  }

  async update(
    id: string,
    updateDto: UpdateCategoriaMerchandisingDto,
  ): Promise<CategoriaMerchandisingResponseDto | null> {
    return this.prisma.categoriaMerchandising.update({
      where: { id },
      data: {
        nombre: updateDto.nombre,
        descripcion: updateDto.descripcion,
        imagen: updateDto.imagen,
        status: updateDto.status,
        is_active: updateDto.is_active,
      },
    });
  }

  async remove(
    id: string,
  ): Promise<CategoriaMerchandisingResponseDto | null> {
    return this.prisma.categoriaMerchandising.delete({
      where: { id },
    });
  }
}
