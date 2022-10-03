import { Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Roles } from './decorators/roles.decorator';
import { User, UserInfo } from './user/decorators/user.decorator';

@ApiBearerAuth()
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Roles()
	@Get('play')
	getGameplayCards(@User() user: UserInfo) {
		return this.appService.getGameplayCards(user);
	}

	@Post('home')
	homePage() {
		return 'Welcome to drunk knight';
	}
}
