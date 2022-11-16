import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Roles } from './decorators/roles.decorator';
import { PlayDto } from './dto/app.dto';
import { User, UserInfo } from './user/decorators/user.decorator';

@ApiBearerAuth()
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	homePage() {
		return 'Welcome to drunk knight';
	}

	@Roles()
	@Post('play')
	getGameplayCards(@User() user: UserInfo, @Body() body: PlayDto) {
		return this.appService.getGameplayCards(user, body.useStandard);
	}
}
