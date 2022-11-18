import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserInfo } from './user/decorators/user.decorator';
import { Card, UserType } from '@prisma/client';
import { CardResponseDto } from './card/dto/card.dto';

enum ADMIN {
	NAME = '__admin',
	DECK = '__standard',
}
@Injectable()
export class AppService {
	constructor(private readonly prismaService: PrismaService) {}

	async getGameplayCards(user: UserInfo, useStandard: boolean) {
		let gamePlayCards: Card[] = [];

		if (useStandard) {
			const gameplayDecks = await this.prismaService.user.findFirst({
				where: {
					userType: UserType.ADMIN,
				},
				select: {
					decks: {
						where: {
							name: ADMIN.DECK,
						},
						select: {
							cards: true,
						},
					},
				},
			});

			gamePlayCards = gameplayDecks?.decks[0]?.cards;
			gamePlayCards = gamePlayCards ? gamePlayCards : [];
		}

		if (user && user.name != ADMIN.NAME) {
			const deckCards = await this.prismaService.deck.findMany({
				where: {
					userId: user.id,
					selected: true,
				},
				select: {
					cards: true,
				},
			});
			const userCards = deckCards.map((deck) => deck.cards).flat(3);
			gamePlayCards = [...gamePlayCards, ...userCards];
		}

		gamePlayCards = this.shuffle(gamePlayCards);
		return gamePlayCards.map((card) => new CardResponseDto(card));
	}

	/**
	 * Shuffles array in place.
	 * @param {Array} a An array containing the items.
	 */
	shuffle(a: any[]) {
		var j: any, x: any, i: any;
		for (i = a.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = a[i];
			a[i] = a[j];
			a[j] = x;
		}
		return a;
	}
}
