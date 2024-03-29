import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CardType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CardResponseDto, CreateCardDto, UpdateCardDto } from './dto/card.dto';

export const cardSelect = {
	id: true,
	name: true,
	description: true,
	cardType: true,
};
interface CardFilter {
	cardType: CardType;
}

@Injectable()
export class CardService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAllCards(userId: string, deckId: string, filter: CardFilter) {
		const deck = await this.prismaService.deck.findFirst({
			where: {
				id: deckId,
			},
			select: {
				userId: true,
				cards: {
					where: filter,
				},
			},
		});

		if (!deck) throw new NotFoundException();
		if (deck.userId !== userId) throw new BadRequestException();

		return deck.cards.map((card) => new CardResponseDto(card));
	}

	async getCardById(userId: string, deckId: string, cardId: string) {
		const deck = await this.prismaService.deck.findFirst({
			where: {
				id: deckId,
			},
			select: {
				userId: true,
				cards: {
					where: {
						id: cardId,
					},
				},
			},
		});

		if (!deck) throw new NotFoundException();
		if (deck.userId !== userId) throw new BadRequestException();

		return new CardResponseDto(deck.cards[0]);
	}

	async createCard(
		deckId: string,
		{ name, description, cardType }: CreateCardDto,
	) {
		const card = await this.prismaService.card.create({
			data: {
				name: name,
				description: description,
				cardType: cardType,
				deckId: deckId,
			},
		});

		return new CardResponseDto(card);
	}

	async updateCardById(id: string, data: UpdateCardDto) {
		const updatedCard = await this.prismaService.card.update({
			where: {
				id,
			},
			data,
		});

		return new CardResponseDto(updatedCard);
	}

	async deleteCardById(id: string) {
		const card = await this.prismaService.card.delete({
			where: {
				id,
			},
		});

		return new CardResponseDto(card);
	}

	async getDeckByCardId(id: string) {
		const card = await this.prismaService.card.findFirst({
			where: {
				id,
			},
			select: {
				deck: true,
			},
		});

		if (!card) throw new NotFoundException();

		return card.deck;
	}

	async getUserByDeckId(id: string) {
		const deck = await this.prismaService.deck.findUnique({
			where: {
				id,
			},
			select: {
				user: {
					select: {
						id: true,
						username: true,
						email: true,
					},
				},
			},
		});

		if (!deck) throw new NotFoundException();

		return deck.user;
	}
}
