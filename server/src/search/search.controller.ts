import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { SearchDto } from './dtos/search.dto';
import { SearchService } from './search.service';

@ApiBearerAuth()
@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Roles(UserType.DEFAULT, UserType.ADMIN)
	@Get('')
	getTopDecks() {
		return this.searchService.getTopdecks();
	}

	@Roles(UserType.DEFAULT, UserType.ADMIN)
	@Post('/deck')
	searchDecks(@Body() body: SearchDto) {
		return this.searchService.searchDecks(body);
	}

	@Roles(UserType.DEFAULT, UserType.ADMIN)
	@Get('/deck/:deckId')
	getDeckAndCards(@Param('deckId') deckId: string) {
		return this.searchService.getDeckAndCards(deckId);
	}

	@Roles(UserType.DEFAULT, UserType.ADMIN)
	@Post('/deck/:deckId')
	copyDeck(@Param('deckId') deckId: string, @User() user: UserInfo) {
		return this.searchService.copyDeck(deckId, user.id);
	}
}
