import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CardType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';


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

    async getAllCards(filter: CardFilter) {
        const cards = await this.prismaService.card.findMany({
            select: cardSelect,
            where: filter
        });

        if (!cards.length) throw new NotFoundException();

        return cards;
    }

    async getCardById(id: string) {
        const card = await this.prismaService.card.findFirst({
            where: {
                id: id
            },
            select: cardSelect
        });

        if (!card) throw new BadRequestException();

        return card;
    }
}
