import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto, UserResponseDto } from './dtos/user.dto';

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	async getUserProfile(id: string) {
		const user = await this.prismaService.user.findFirst({
			where: {
				id: id,
			},
		});

		return new UserResponseDto(user);
	}

	async updateUserProfile(data: UpdateUserDto, id: string) {
		const user = await this.prismaService.user.update({
			where: {
				id,
			},
			data,
		});

		return new UserResponseDto(user);
	}

	async deleteUser(id: string) {
		await this.prismaService.user.delete({
			where: {
				id,
			},
		});

		return 'Successfully Deleted';
	}
}
