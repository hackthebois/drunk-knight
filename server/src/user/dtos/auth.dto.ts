import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class SignUpDto {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsEmail()
	email: string;

	@IsString()
	@MinLength(5)
	@IsNotEmpty()
	password: string;
}

export class SignInDto {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}

export class PasswordResetDto {
	@IsEmail()
	email: string;
}

export class PasswordUpdateDto {
	@IsString()
	@IsNotEmpty()
	password: string;
}

export class ResendEmailDto {
	@IsEmail()
	email: string;
}
