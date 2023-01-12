import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Roles } from './decorators/roles.decorator';
import { PlayDto } from './dto/app.dto';
import { User, UserInfo } from './user/decorators/user.decorator';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	homePage() {
		return 'Server is Live';
	}

	@Get('standard')
	getStandardDeck() {
		return this.appService.getStandardDeck();
	}

	@Get('standard/:id')
	getStandardCards(@Param('id') id: string) {
		return this.appService.getStandardCards(id);
	}

	@ApiBearerAuth()
	@Roles()
	@Post('play')
	getGameplayCards(@User() user: UserInfo, @Body() body: PlayDto) {
		return this.appService.getGameplayCards(user, body.useStandard);
	}
}
