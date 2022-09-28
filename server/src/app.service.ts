import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserInfo } from './user/decorators/user.decorator';
import { UserType } from '@prisma/client';
import { CardResponseDto } from './card/dto/card.dto';

@Injectable()
export class AppService {
	constructor(private readonly prismaService: PrismaService) {}

	async getGameplayCards(user: UserInfo) {
		const gameplayDecks = await this.prismaService.user.findFirst({
			where: {
				user_type: UserType.ADMIN,
			},
			select: {
				decks: {
					select: {
						cards: true,
					},
				},
			},
		});

		const standardCards = gameplayDecks?.decks[0].cards;

		if (user && user.name != '__admin') {
			const deckCards = await this.prismaService.deck.findMany({
				where: {
					user_id: user.id,
					selected: true,
				},
				select: {
					cards: true,
				},
			});
			const userCards = deckCards.map((deck) => deck.cards).flat(3);
			return [...standardCards, ...userCards].map(
				(card) => new CardResponseDto(card),
			);
		}
		return standardCards.map((card) => new CardResponseDto(card));
	}
}
