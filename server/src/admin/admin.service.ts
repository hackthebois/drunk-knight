import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CardType, UserType } from '@prisma/client';
import { UpdateCardDto } from 'src/card/dto/card.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from 'src/user/dtos/user.dto';

interface UserFilter {
    user_type: UserType;
}

interface CardFilter {
    card_type: CardType;
}

@Injectable()
export class AdminService {

    constructor(private readonly prismaService: PrismaService) {}

    async getAllUsers(filter: UserFilter) {
        return await this.prismaService.user.findMany({
            where: filter
        });
    }

    async getUser(id: string) {
        const user = await this.prismaService.user.findFirst({
            where: {
                id
            }
        });

        if(!user) throw new NotFoundException();

        return user;
    }

    async updateUser(id: string, data: UpdateUserDto) {

        const userExists = await this.prismaService.user.findUnique({
            where:data
        });

        if(userExists) throw new BadRequestException();

        this.isAdmin(id);

        const updatedUser = await this.prismaService.user.update({
            where: {
                id
            },
            data
        });

        return updatedUser;
    }

    async deleteUser(id: string){

        this.isAdmin(id);

        await this.prismaService.user.delete({
          where: {
            id
          }  
        });

        return "Deleted Successfully";
    }

    async getUserCards(id: string, filter: CardFilter,) {

        const user = await this.prismaService.user.findFirst({
            where: {
                id: id
            },
            select: {
                cards: {
                    where: filter
                }
            }
        });

        if (!user) throw new NotFoundException();

        return user.cards;
    }

    async getUserCardById(userId: string, cardId: string) {
        const userCard = await this.prismaService.card.findFirst({
            where: {
                id: cardId,
                user: {
                    id: userId
                }
            }
        });

        if(!userCard) throw new NotFoundException();

        return userCard;
    }

    async updateUserCard(userId: string, cardId: string, data: UpdateCardDto) {

        this.isAdmin(userId);

        const updatedCard = await this.prismaService.card.update({
            where:{
                id: cardId
            },
            data,
        });

        return updatedCard;
    }

    async deleteUserCardById(userId: string, cardId: string) {

        this.isAdmin(userId);

        await this.prismaService.card.delete({
            where:{
                id: cardId,
            }
        });

        return "Successfully Deleted";
    }

    private async isAdmin(id: string) {
        const user = await this.getUser(id);

        if(user.user_type === UserType.ADMIN) throw new HttpException("You Cannot Modify the Admin Account", 400);
    }
}
