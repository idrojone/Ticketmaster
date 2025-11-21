import { Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/common/src/prisma';

@Injectable()
export class MerchAxiosService {
    constructor(private readonly prisma: PrismaService) { }

    async findOneRandom(): Promise<string> {
        const allMerchandisings = await this.prisma.merchandising.findMany();
        if (allMerchandisings.length === 0) {
            return '';
        }
        const randomIndex = Math.floor(Math.random() * allMerchandisings.length);
        return allMerchandisings[randomIndex].id;
    }
}