import { Injectable, NotFoundException } from '@nestjs/common';
import { CardType, UserType } from '@prisma/client';
import { CardResponseDto } from 'src/card/dto/card.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchDto } from './dtos/search.dto';

@Injectable()
export class SearchService {
	constructor(private readonly prismaService: PrismaService) {}

	async getTopdecks() {
		return await this.prismaService.deck.findMany({
			where: {
				user: {
					userType: UserType.DEFAULT,
				},
				standard: false,
				private: false,
			},
			orderBy: {
				copiedNumber: 'asc',
			},
			select: {
				id: true,
				name: true,
				user: {
					select: {
						username: true,
					},
				},
			},
			take: 10,
		});
	}

	async searchDecks(body: SearchDto) {
		return await this.prismaService.deck.findMany({
			where: {
				name: {
					contains: body.searchParam,
				},
				user: {
					userType: UserType.DEFAULT,
				},
				standard: false,
				private: false,
			},
			select: {
				id: true,
				name: true,
				user: {
					select: {
						id: true,
						username: true,
					},
				},
			},
		});
	}

	async getDeckAndCards(deckId: string) {
		const deck = await this.prismaService.deck.findFirst({
			where: {
				id: deckId,
			},
			select: {
				name: true,
				cards: true,
			},
		});

		if (!deck) throw new NotFoundException();

		return {
			name: deck.name,
			cards: deck.cards.map((card) => new CardResponseDto(card)),
		};
	}

	async copyDeck(deckId: string, userId: string) {
		const deck = await this.prismaService.deck.update({
			where: {
				id: deckId,
			},
			data: {
				copiedNumber: { increment: 1 },
			},
			select: {
				name: true,
				cards: {
					select: {
						name: true,
						description: true,
						cardType: true,
					},
				},
			},
		});

		if (!deck) throw new NotFoundException();

		const userDeck = await this.prismaService.deck.create({
			data: {
				name: deck.name,
				selected: false,
				userId: userId,
			},
		});

		const data = deck.cards.map((card) => ({
			...card,
			deckId: userDeck.id,
		}));

		await this.prismaService.card.createMany({
			data: data,
		});
	}
}
