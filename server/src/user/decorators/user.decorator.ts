import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserInfo {
	id: string;
	name: string;
	iat: Date;
	exp: Date;
}

export const User = createParamDecorator((data, context: ExecutionContext) => {
	const request = context.switchToHttp().getRequest();
	return request.user;
});
