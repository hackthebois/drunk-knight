import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './decorators/roles.decorator';
import { User, UserInfo } from './user/decorators/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Roles()
  @Get("play")
  getGameplayCards(@User() user: UserInfo){
    return this.appService.getGameplayCards(user);
  }
}
