import { Body, Controller, Delete, Get, HttpException, Param, Put } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserInfo } from './decorators/user.decorator';
import { UpdateUserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {

    constructor(private readonly userService: UserService){}

    @Roles(UserType.DEFAULT, UserType.ADMIN)
    @Get("/account")
    getUserProfile(@User() user: UserInfo){
        return this.userService.getUserProfile(user.id);
    }

    @Roles(UserType.DEFAULT, UserType.ADMIN)
    @Put("/account")
    updateUserProfile(@User() user: UserInfo, @Body() body: UpdateUserDto){
        return this.userService.updateUserProfile(body, user.id);
    }

    @Roles(UserType.DEFAULT, UserType.ADMIN)
    @Delete("/account")
    deleteUser(@User() user: UserInfo) {

        if(user.name === "Admin") throw new HttpException("You Cannot Delete the Admin Account", 400);

        return this.userService.deleteUser(user.id);
    }
}
