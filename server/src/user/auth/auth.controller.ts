import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common';
import { PasswordResetDto, SignInDto, SignUpDto } from '../dtos/auth.dto';
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

    @Get("confirm/:token")
    @Redirect("http://localhost:8000/auth/confirm", 301)
    emailVarification(@Param("token") token: string){
        return this.authService.verifyEmailConfirmation(token);
    }

    @Get("/confirm")
    confirmedEmailVarification(@Param("error") error: string){
        if(error && error.includes("jwt")) return "JWT ERROR";
        
        return "CONFIRMED EMAIL";
    }

    @Get("/password-reset")
    passwordReset(@Body() body: PasswordResetDto){
        return this.authService.passwordReset(body);
    }
}
