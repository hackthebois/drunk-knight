import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	Redirect,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import {
	PasswordResetDto,
	PasswordUpdateDto,
	ResendEmailDto,
	SignInDto,
	SignUpDto,
} from '../dtos/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiBody({type: SignUpDto})
	@Post('/signup')
	signup(@Body() body: SignUpDto) {
		return this.authService.signup(body);
	}

	@Post('/signin')
	signin(@Body() body: SignInDto) {
		return this.authService.signin(body);
	}

	@Post('resend-email')
	resendEmailVarification(@Body() body: ResendEmailDto) {
		return this.authService.resendEmailVarification(body);
	}

	@Get('/confirm/:token')
	@Redirect(`${process.env.HOST_URL}/auth/confirm`, 301)
	emailVarification(@Param('token') token: string) {
		return this.authService.verifyEmailConfirmation(token);
	}

	@Post('/password-reset')
	passwordReset(@Body() body: PasswordResetDto) {
		return this.authService.passwordReset(body);
	}

	@Post('/password-reset/:token')
	@Redirect(`${process.env.HOST_URL}/home`, 301)
	passwordUpdate(
		@Param('token') token: string,
		@Body() body: PasswordUpdateDto,
	) {
		return this.authService.passwordUpdate(token, body);
	}
}
