import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	Param,
	Put,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserInfo } from './decorators/user.decorator';
import { UpdateUserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@Controller('/account')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Roles(UserType.DEFAULT, UserType.ADMIN)
	@Get()
	getUserProfile(@User() user: UserInfo) {
		return this.userService.getUserProfile(user.id);
	}

	@Roles(UserType.DEFAULT, UserType.ADMIN)
	@Put()
	updateUserProfile(@User() user: UserInfo, @Body() body: UpdateUserDto) {
		if (!body.email && !body.username) throw new BadRequestException();
		return this.userService.updateUserProfile(body, user.id);
	}

	@Roles(UserType.DEFAULT, UserType.ADMIN)
	@Delete()
	deleteUser(@User() user: UserInfo) {
		if (user.name === 'Admin')
			throw new HttpException('You Cannot Delete the Admin Account', 400);

		return this.userService.deleteUser(user.id);
	}
}
