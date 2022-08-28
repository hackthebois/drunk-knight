import { Controller, Get } from '@nestjs/common';
import { timeStamp } from 'console';
import { AppService } from './app.service';
import { Roles } from './decorators/roles.decorator';
import { User, UserInfo } from './user/decorators/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Roles()
  @Get("play")
  getGameplayCards(@User() user: UserInfo){
    return this.appService.getGameplayCards(user);
  }
}
