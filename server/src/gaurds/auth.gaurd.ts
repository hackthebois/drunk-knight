import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

interface JWTPayload {
	name: string;
	id: string;
	iat: number;
	exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly prismaService: PrismaService,
	) {}

	async canActivate(context: ExecutionContext) {
		const roles = this.reflector.getAllAndOverride('roles', [
			context.getHandler(),
			context.getClass(),
		]);

		const request = context.switchToHttp().getRequest();

		if (request.headers && request.headers.authorization) {
			const token = request.headers?.authorization?.split('Bearer ')[1];

			try {
				const payload = (await jwt.verify(
					token,
					process.env.JSON_SECRET_KEY,
				)) as JWTPayload;

				const user = await this.prismaService.user.findFirst({
					where: {
						id: payload.id,
					},
				});

				if (
					!user ||
					(!roles.includes(user.userType) &&
						roles?.length !== 0 &&
						user.emailConfirmation)
				)
					return false;
			} catch (error) {
				return false;
			}
		}

		return true;
	}
}
