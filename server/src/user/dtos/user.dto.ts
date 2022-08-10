import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class UserResponseDto {
    id: string;
    username: string;
    email: string;

    constructor(paritial: Partial<UserResponseDto>) {
        this.id = paritial.id;
        this.username = paritial.username;
        this.email = paritial.email;
      }
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;
}