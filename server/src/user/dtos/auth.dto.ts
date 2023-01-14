import { ApiProperty } from '@nestjs/swagger';
import {
	IsString,
	IsNotEmpty,
	IsEmail,
	MinLength,
	MaxLength,
} from 'class-validator';

export class SignUpDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MaxLength(190)
	username: string;

	@IsEmail()
	@ApiProperty()
	@MaxLength(190)
	email: string;

	@IsString()
	@MinLength(5)
	@IsNotEmpty()
	@ApiProperty()
	password: string;
}

export class SignInDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	username: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	password: string;
}

export class PasswordResetDto {
	@IsEmail()
	@ApiProperty()
	email: string;
}

export class PasswordUpdateDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	password: string;
}

export class ResendEmailDto {
	@IsEmail()
	@ApiProperty()
	email: string;
}
