import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UnauthorizedException,
} from '@nestjs/common';
import { UserType } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { DeckService } from './deck.service';
import { CreateDeckDto, UpdateDeckDto } from './dto/deck.dto';

@Controller('/deck')
export class DeckController {
	constructor(private readonly deckService: DeckService) {}

	@Roles(UserType.DEFAULT, UserType.ADMIN)
	@Get()
	getAllDecks(@User() user: UserInfo) {
		return this.deckService.getAllDecks(user.id);
	}

	@Roles(UserType.DEFAULT, UserType.ADMIN)
	@Get('/:id')
	getDeckById(@Param('id') id: string) {
		return this.deckService.getDeckById(id);
	}

	@Roles(UserType.DEFAULT, UserType.ADMIN)
	@Post('/create')
	createDeck(@User() user: UserInfo, @Body() body: CreateDeckDto) {
		return this.deckService.createDeck(user.id, body);
	}

	@Roles(UserType.DEFAULT, UserType.ADMIN)
	@Put('/:id')
	async updateDeckById(
		@User() user: UserInfo,
		@Body() body: UpdateDeckDto,
		@Param('id') id: string,
	) {
		const deckOwner = await this.deckService.getUserByDeckId(id);
		if (deckOwner.id !== user.id) throw new UnauthorizedException();

		return this.deckService.updateDeckById(id, body);
	}

	@Roles(UserType.DEFAULT, UserType.ADMIN)
	@Delete('/:id')
	async deleteDeckById(@User() user: UserInfo, @Param('id') id: string) {
		const deckOwner = await this.deckService.getUserByDeckId(id);
		if (deckOwner.id !== user.id) throw new UnauthorizedException();

		return this.deckService.deleteDeckById(id);
	}
}
