import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto, UserResponseDto } from './dtos/user.dto';

@Injectable()
export class UserService {

    constructor(private readonly prismaService: PrismaService){}

    async getUserById(id: string) {
        const user = await this.prismaService.user.findFirst({
            where: {
                id: id,
                user_type: UserType.DEFAULT
            },
        });

        if(!user) throw new NotFoundException();

        return new UserResponseDto(user);
    }


    async getUserProfile(id: string) {
        const user =  await this.prismaService.user.findFirst({
            where: {
              id: id
            }
          });
        
        return new UserResponseDto(user);
    }

    async updateUserProfile(data: UpdateUserDto, id: string) {
        
        const user = await this.prismaService.user.update({
            where: {
                id
            },
            data
        });

        return new UserResponseDto(user);
    }

    async deleteUser(id: string) {
        await this.prismaService.user.delete({
            where:{
                id,
            }
        });

        return "Successfully Deleted";
    }
}
