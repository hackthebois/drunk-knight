import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UnauthorizedException,
	UseInterceptors,
} from '@nestjs/common';
import { CardType, UserType } from '@prisma/client';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { CardService } from './card.service';
import { CreateCardDto, UpdateCardDto } from './dto/card.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('/deck/:deckId/card')
export class CardController {
	constructor(private readonly cardService: CardService) {}
	@ApiQuery({ name: 'cardtype', enum: CardType })
	@Roles(UserType.DEFAULT, UserType.ADMIN)
	@Get()
	getAllCards(
		@User() user: UserInfo,
		@Param('deckId') deckId: string,
		@Query('cardtype') cardType?: CardType,
	) {
		const filter = cardType in CardType ? { cardType } : undefined;
		return this.cardService.getAllCards(user.id, deckId, filter);
	}

	@Roles(UserType.DEFAULT, UserType.ADMIN)
	@Get('/:id')
	async getCardById(
		@User() user: UserInfo,
		@Param('deckId') deckId: string,
		@Param(':id') cardId: string,
	) {
		return this.cardService.getCardById(user.id, deckId, cardId);
	}

	@Roles(UserType.DEFAULT, UserType.ADMIN)
	@Post('/create')
	async createCard(
		@User() user: UserInfo,
		@Param('deckId') deckId: string,
		@Body() body: CreateCardDto,
	) {
		const deckOwner = await this.cardService.getUserByDeckId(deckId);
		if (user.id !== deckOwner.id) throw new UnauthorizedException();

		return this.cardService.createCard(deckId, body);
	}

	@Roles(UserType.DEFAULT, UserType.ADMIN)
	@Put('/:id')
	async updateCardById(
		@User() user: UserInfo,
		@Param('deckId') deckId: string,
		@Param('id') cardId: string,
		@Body() body: UpdateCardDto,
	) {
		const deck = await this.cardService.getDeckByCardId(cardId);
		if (deck.userId !== user.id || deck.id !== deckId)
			throw new UnauthorizedException();

		return this.cardService.updateCardById(cardId, body);
	}

	@Roles(UserType.DEFAULT, UserType.ADMIN)
	@Delete('/:id')
	async deleteCardById(
		@User() user: UserInfo,
		@Param('deckId') deckId: string,
		@Param('id') cardId: string,
	) {
		const deck = await this.cardService.getDeckByCardId(cardId);
		if (deck.userId !== user.id || deck.id !== deckId)
			throw new UnauthorizedException();

		return this.cardService.deleteCardById(cardId);
	}
}
