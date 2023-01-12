import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserInfo } from './user/decorators/user.decorator';
import { Card, UserType } from '@prisma/client';
import { CardResponseDto } from './card/dto/card.dto';
import { DeckResponseDto } from './deck/dto/deck.dto';

@Injectable()
export class AppService {
	constructor(private readonly prismaService: PrismaService) {}

	async getGameplayCards(user: UserInfo, excludeDeckIds: string[]) {
		let gamePlayCards: Card[] = [];

		const standardDecks = await this.prismaService.deck.findMany({
			where: {
				user: {
					userType: UserType.ADMIN,
				},
				standard: true,
				private: false,
			},
			select: {
				id: true,
				cards: true,
			},
		});
		if (standardDecks)
			gamePlayCards = standardDecks
				.map((deck) => {
					if (!excludeDeckIds.includes(deck.id)) return deck.cards;
					return [];
				})
				.flat(3);

		if (user) {
			const userDecks = await this.prismaService.deck.findMany({
				where: {
					userId: user.id,
					selected: true,
					standard: false,
				},
				select: {
					cards: true,
				},
			});
			const userCards = userDecks.map((deck) => deck.cards).flat(3);
			gamePlayCards = gamePlayCards.concat(userCards);
		}
		gamePlayCards = this.shuffle(gamePlayCards);
		return gamePlayCards.map((card) => new CardResponseDto(card));
	}

	async getStandardDeck() {
		const decks = await this.prismaService.deck.findMany({
			where: {
				standard: true,
				private: false,
			},
			select: {
				id: true,
				name: true,
				selected: true,
				cards: true,
			},
		});

		return decks.map((deck) => new DeckResponseDto(deck));
	}
	async getStandardCards(id: string) {
		return await this.prismaService.deck.findFirst({
			where: {
				id: id,
			},
			select: {
				name: true,
				cards: true,
			},
		});
	}

	/**
	 * Shuffles array in place.
	 * @param {Array} a An array containing the items.
	 */
	private shuffle(a: any[]) {
		let j: any, x: any, i: any;
		for (i = a.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = a[i];
			a[i] = a[j];
			a[j] = x;
		}
		return a;
	}
}
