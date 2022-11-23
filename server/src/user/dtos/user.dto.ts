import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserResponseDto {
	id: string;
	username: string;
	email: string;
	emailConfirmation: boolean;

	constructor(partial: any) {
		this.id = partial.id;
		this.username = partial.username;
		this.email = partial.email;
		this.emailConfirmation = partial.emailConfirmation;
	}
}

export class UpdateUserDto {
	@IsString()
	@IsOptional()
	@ApiProperty()
	username?: string;

	@IsEmail()
	@IsOptional()
	@ApiProperty()
	email?: string;

	@IsOptional()
	emailConfirmation?: boolean;
}
