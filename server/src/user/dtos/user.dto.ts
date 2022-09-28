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
		this.emailConfirmation = partial.email_confirmation;
	}
}

export class UpdateUserDto {
	@IsString()
	@IsOptional()
	username: string;

	@IsEmail()
	@IsOptional()
	email: string;
}
