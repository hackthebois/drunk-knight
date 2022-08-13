import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User, UserInfo } from '../decorators/user.decorator';
import { SignInDto, SignUpDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    
    @Post("/signup")
    signup(@Body() body: SignUpDto){
        return this.authService.signup(body);
    }

    @Post("/signin")
    signin(@Body() body: SignInDto){
        return this.authService.signin(body);
    }

    // @Get("/profile")
    // async userProfile(@User() user: UserInfo){
    //     const userDetails = await this.authService.getUserProfile(user.id);
    //     return {token: user, userDetails: userDetails};
    // }

    @Get("confirm/:token")
    emailVarification(@Param("token") token: string){
        return this.authService.verifyEmailConfirmation(token);
    }
}
