import {
	BadRequestException,
	HttpException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CardType, UserType } from '@prisma/client';
import { UpdateCardDto } from 'src/card/dto/card.dto';
import { UpdateDeckDto } from 'src/deck/dto/deck.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from 'src/user/dtos/user.dto';

interface UserFilter {
	userType: UserType;
}

interface CardFilter {
	cardType: CardType;
}

@Injectable()
export class AdminService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAllUsers(filter: UserFilter) {
		return await this.prismaService.user.findMany({
			where: filter,
		});
	}

	async getAllDecks() {
		return await this.prismaService.deck.findMany();
	}

	async getAllCards(filter: CardFilter) {
		return await this.prismaService.card.findMany({
			where: filter,
		});
	}

	async getUser(userId: string) {
		const user = await this.prismaService.user.findFirst({
			where: {
				id: userId,
			},
		});

		if (!user) throw new NotFoundException();

		return user;
	}

	async updateUser(userId: string, data: UpdateUserDto) {
		const userExists = await this.prismaService.user.findUnique({
			where: data,
		});

		if (userExists) throw new BadRequestException();

		this.isAdmin(userId);

		const updatedUser = await this.prismaService.user.update({
			where: {
				id: userId,
			},
			data,
		});

		return updatedUser;
	}

	async deleteUser(userId: string) {
		this.isAdmin(userId);

		await this.prismaService.user.delete({
			where: {
				id: userId,
			},
		});

		return 'Deleted Successfully';
	}

	async getUserDecks(userId: string) {
		const decks = await this.prismaService.deck.findMany({
			where: {
				userId: userId,
			},
		});

		return decks;
	}

	async updateUserDeckById(
		userId: string,
		deckId: string,
		data: UpdateDeckDto,
	) {
		this.isAdmin(userId);

		const deckExists = await this.prismaService.deck.findFirst({
			where: {
				id: deckId,
				userId: userId,
			},
		});

		if (!deckExists) throw new NotFoundException();

		return await this.prismaService.deck.update({
			where: {
				id: deckId,
			},
			data: data,
		});
	}

	async deleteUserDeckById(userId: string, deckId: string) {
		this.isAdmin(userId);

		const deckExists = await this.prismaService.deck.findFirst({
			where: {
				id: deckId,
				userId: userId,
			},
		});

		if (!deckExists) throw new NotFoundException();

		await this.prismaService.deck.delete({
			where: {
				id: deckId,
			},
		});

		return `Successfully Delete Deck named "${deckExists.name}"`;
	}

	async getDeckCards(userId: string, deckId: string, filter: CardFilter) {
		const deck = await this.prismaService.deck.findFirst({
			where: {
				id: deckId,
				userId: userId,
			},
			select: {
				cards: {
					where: filter,
				},
			},
		});

		if (!deck) throw new NotFoundException();

		return deck.cards;
	}

	async updateDeckCard(
		userId: string,
		deckId: string,
		cardId: string,
		data: UpdateCardDto,
	) {
		this.isAdmin(userId);

		const cardExists = await this.prismaService.card.findFirst({
			where: {
				id: cardId,
				deckId: deckId,
				deck: {
					userId: userId,
				},
			},
		});

		if (!cardExists) throw new NotFoundException();

		const updatedCard = await this.prismaService.card.update({
			where: {
				id: cardId,
			},
			data,
		});

		return updatedCard;
	}

	async deleteDeckCard(userId: string, deckId: string, cardId: string) {
		this.isAdmin(userId);

		const cardExists = await this.prismaService.card.findFirst({
			where: {
				id: cardId,
				deckId: deckId,
				deck: {
					userId: userId,
				},
			},
		});

		if (!cardExists) throw new NotFoundException();

		await this.prismaService.card.delete({
			where: {
				id: cardId,
			},
		});

		return `Successfully Delete Card named "${cardExists.name}"`;
	}

	private async isAdmin(id: string) {
		const user = await this.getUser(id);

		if (user.userType === UserType.ADMIN)
			throw new HttpException('You Cannot Modify the Admin Account', 400);
	}
}
