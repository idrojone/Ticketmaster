import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '@app/common';
import { CreateCategoriaMerchandisingDto, UpdateCategoriaMerchandisingDto, CategoriaMerchandisingResponseDto } from './dto';

@Injectable()
export class CategoriaMerchandisingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CategoriaMerchandisingResponseDto[]> {
    const data = await this.prisma.categoriaMerchandising.findMany();
    return plainToClass(CategoriaMerchandisingResponseDto, data);
  }

  async findOne(id: string): Promise<CategoriaMerchandisingResponseDto> {
    const data = await this.prisma.categoriaMerchandising.findUnique({
      where: { id },
    });
    return plainToClass(CategoriaMerchandisingResponseDto, data);
  }

  async create(createDto: CreateCategoriaMerchandisingDto): Promise<CategoriaMerchandisingResponseDto> {
    const data = await this.prisma.categoriaMerchandising.create({
      data: {
        nombre: createDto.nombre,
        descripcion: createDto.descripcion,
        imagen: createDto.imagen,
      },
    });
    return plainToClass(CategoriaMerchandisingResponseDto, data);
  }

  async update(id: string, updateDto: UpdateCategoriaMerchandisingDto): Promise<CategoriaMerchandisingResponseDto> {
    const data = await this.prisma.categoriaMerchandising.update({
      where: { id },
      data: {
        nombre: updateDto.nombre,
        descripcion: updateDto.descripcion,
        imagen: updateDto.imagen,
      },
    });
    return plainToClass(CategoriaMerchandisingResponseDto, data);
  }

  async remove(id: string): Promise<CategoriaMerchandisingResponseDto> {
    const data = await this.prisma.categoriaMerchandising.delete({
      where: { id },
    });
    return plainToClass(CategoriaMerchandisingResponseDto, data);
  }
}
