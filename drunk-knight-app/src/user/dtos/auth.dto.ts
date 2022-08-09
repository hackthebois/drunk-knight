import { IsString, IsNotEmpty, IsEmail, MinLength } from "class-validator";

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