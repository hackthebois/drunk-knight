import {
	BadRequestException,
	ConflictException,
	HttpException,
	Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
	PasswordResetDto,
	PasswordUpdateDto,
	ResendEmailDto,
	SignInDto,
	SignUpDto,
} from '../dtos/auth.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

// const transport = nodemailer.createTransport({
// 	host: 'smtp.gmail.com',
// 	port: 465,
// 	secure: true,
// 	auth: {
// 		user: process.env.EMAIL_USERNAME,
// 		pass: process.env.EMAIL_PASSWORD,
// 	},
// });

const transport = nodemailer.createTransport({
	host: 'smtp.zoho.com',
	port: 465,
	secure: true,
	auth: {
		user: process.env.Z_EMAIL_USERNAME,
		pass: process.env.Z_EMAIL_PASSWORD,
	},
});

interface JWTPayload {
	name: string;
	iat: number;
	exp: number;
}

@Injectable()
export class AuthService {
	constructor(private readonly prismaService: PrismaService) {}

	async signup({ email, password, username }: SignUpDto) {
		const userExists = await this.prismaService.user.findUnique({
			where: {
				email,
			},
		});

		if (userExists) throw new ConflictException();

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await this.prismaService.user.create({
			data: {
				email: email,
				username: username,
				password: hashedPassword,
			},
		});

		this.sendEmailConfirmation(email);

		return { token: this.generateJWT(user.username, user.id) };
	}

	async signin({ username, password }: SignInDto) {
		const user = await this.prismaService.user.findUnique({
			where: {
				username,
			},
		});

		if (!user) throw new HttpException('Invalid credentials', 400);

		if (!user.emailConfirmation)
			throw new BadRequestException(
				'Please Confirm Email Before Attemping to Log In',
			);

		const hashedPassword = user.password;

		const isValidPassword = await bcrypt.compare(password, hashedPassword);

		if (!isValidPassword)
			throw new HttpException('Invalid credentials', 400);

		return { token: this.generateJWT(user.username, user.id) };
	}

	async resendEmailVarification({ email }: ResendEmailDto) {
		const user = await this.prismaService.user.findFirst({
			where: {
				email: email,
			},
		});

		if (!user)
			throw new BadRequestException('No User with this email Exists');

		return this.sendEmailConfirmation(email);
	}

	async verifyEmailConfirmation(token: string) {
		try {
			const payload = jwt.verify(
				token,
				process.env.JSON_EMAIL_SECRET_KEY,
			) as JWTPayload;

			const user = await this.prismaService.user.findUnique({
				where: {
					email: payload.name,
				},
			});

			await this.prismaService.user.update({
				where: {
					email: payload.name,
				},
				data: {
					emailConfirmation: true,
				},
			});

			return user;
		} catch (error) {
			return {
				url: `${process.env.FRONTEND_URL}/auth/confirm?error=jwt`,
				statusbar: 400,
			};
		}
	}

	async verifyPasswordToken(token: string) {
		try {
			jwt.verify(
				token,
				process.env.JSON_PASSWORD_RESET_SECRET_KEY,
			) as JWTPayload;

			return {
				url: `${process.env.FRONTEND_URL}/auth/password-reset/${token}`,
				statusbar: 200,
			};
		} catch (error) {
			return {
				url: `${process.env.FRONTEND_URL}/auth/confirm?error=jwt`,
				statusbar: 400,
			};
		}
	}

	async passwordUpdate(token: string, { password }: PasswordUpdateDto) {
		try {
			const payload = jwt.verify(
				token,
				process.env.JSON_PASSWORD_RESET_SECRET_KEY,
			) as JWTPayload;
			const user = await this.prismaService.user.findUnique({
				where: {
					email: payload.name,
				},
			});

			if (!user) throw new BadRequestException();

			const hashedPassword = await bcrypt.hash(password, 10);

			await this.prismaService.user.update({
				where: {
					email: user.email,
				},
				data: {
					password: hashedPassword,
				},
			});

			return user;
		} catch (error) {
			return {
				url: `${process.env.FRONTEND_URL}/auth/confirm?error=jwt`,
				statusbar: 400,
			};
		}
	}

	async passwordReset({ email }: PasswordResetDto) {
		const user = await this.prismaService.user.findFirst({
			where: {
				email: email,
			},
		});

		if (user) {
			const url = `${
				process.env.FRONTEND_URL
			}/auth/password-reset/${this.generateEmailJWT(
				email,
				process.env.JSON_PASSWORD_RESET_SECRET_KEY,
			)}`;

			const htmlToSend = this.emailHtml('passwordreset.html', {
				email,
				url,
			});

			await transport.sendMail({
				from: '"Drunk Knight" <no-reply@drunkknight.live>',
				to: email,
				subject: 'Password Reset',
				html: htmlToSend,
			});

			return {
				message: 'Success!',
			};
		}
	}

	async sendEmailConfirmation(email: string) {
		const url = `${
			process.env.BACKEND_URL
		}/auth/confirm/${this.generateEmailJWT(
			email,
			process.env.JSON_EMAIL_SECRET_KEY,
		)}`;

		const htmlToSend = this.emailHtml('email.html', { email, url });

		await transport.sendMail({
			from: '"Drunk Knight" <no-reply@drunkknight.live>',
			to: email,
			subject: 'Email Confirmation',
			html: htmlToSend,
		});
	}

	private emailHtml(fileName: string, replacements: {}) {
		const filePath = path.join(
			__dirname,
			'..',
			'..',
			'..',
			`src/user/html/${fileName}`,
		);
		const source = fs.readFileSync(filePath, 'utf-8').toString();
		const template = handlebars.compile(source);
		return template(replacements);
	}

	private generateEmailJWT(email: string, secretKey: string) {
		return jwt.sign(
			{
				name: email,
			},
			secretKey,
			{
				expiresIn: 900,
			},
		);
	}

	private generateJWT(name: string, id: string) {
		return jwt.sign(
			{
				name,
				id,
			},
			process.env.JSON_SECRET_KEY,
			{
				expiresIn: 3600000,
			},
		);
	}
}
