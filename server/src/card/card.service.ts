import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CardType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CardResponseDto, CreateCardDto, UpdateCardDto } from './dto/card.dto';

export const cardSelect = {
    id: true,
    name: true,
    description: true,
    card_type: true,
};

interface CardFilter {
    card_type: CardType;
}

@Injectable()
export class CardService {

    constructor(private readonly prismaService: PrismaService) { }

    async getAllCards(filter: CardFilter, userId: string) {

        const user = await this.prismaService.user.findFirst({
            where: {
                id: userId
            },
            select: {
                cards: {
                    where: filter
                }
            }
        });

        if (!user) throw new NotFoundException();

        return user.cards.map(card => new CardResponseDto(card));
    }

    async getCardById(id: string) {
        const card = await this.prismaService.card.findFirst({
            where: {
                id: id
            },
            select: cardSelect
        });

        if (!card) throw new NotFoundException();

        return new CardResponseDto(card);
    }

    async createCard({ name, description, cardType }: CreateCardDto, userId: string) {

        const cardExists = await this.prismaService.card.findUnique({
            where:{
                name
            }
        });
        
        if(cardExists) throw new ConflictException();

        const card = await this.prismaService.card.create({
            data: {
                name: name,
                description: description,
                card_type: cardType,
                user_id: userId
            }
        });

        return new CardResponseDto(card);
    }

    async updateCardById(id: string, data: UpdateCardDto) {
        const cardExists = await this.prismaService.card.findUnique({
            where:{
                id
            }
        });

        if(!cardExists) throw new NotFoundException();

        const updatedCard = await this.prismaService.card.update({
            where:{
                id
            },
            data,
        });

        console.log(updatedCard);

        return new CardResponseDto(updatedCard);
    }

    async deleteCardById(id: string){
        await this.prismaService.card.deleteMany({
            where:{
                id,
            }
        });

        return "Successfully Deleted"
    }

    async getUserByCardId(id: string){
        
        const card = await this.prismaService.card.findFirst({
            where: {
                id
            },
            select: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    }
                }
            }
        });

        if(!card) throw new NotFoundException()

        return card.user;
    }
}