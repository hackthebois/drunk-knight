import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import {
  PasswordResetDto,
  PasswordUpdateDto,
  SignInDto,
  SignUpDto,
} from '../dtos/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: SignUpDto) {
    return this.authService.signup(body);
  }

  @Post('/signin')
  signin(@Body() body: SignInDto) {
    return this.authService.signin(body);
  }

  @Get('confirm/:token')
  @Redirect('http://localhost:8000/auth/confirm', 301)
  emailVarification(@Param('token') token: string) {
    return this.authService.verifyEmailConfirmation(token);
  }

  @Get('/confirm')
  confirmedEmailVarification(@Query('error') error: string) {
    const JWT = 'jwt';
    if (error && error.normalize() === JWT) return 'JWT ERROR';

    return 'CONFIRMED EMAIL';
  }

  @Post('/password-reset')
  passwordReset(@Body() body: PasswordResetDto) {
    return this.authService.passwordReset(body);
  }

  @Post('/password-reset/:token')
  @Redirect('http://localhost:8000/home', 301)
  passwordUpdate(
    @Param('token') token: string,
    @Body() body: PasswordUpdateDto,
  ) {
    return this.authService.passwordUpdate(token, body);
  }
}
