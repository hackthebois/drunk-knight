import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {

    constructor(private readonly prismaService: PrismaService) {}

    async getAllUsers() {
        return await this.prismaService.user.findMany();
    }
}
