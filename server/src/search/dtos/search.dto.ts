import { ApiProperty } from '@nestjs/swagger';
import { Deck } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class SearchDto {
	@IsOptional()
	@IsString()
	@ApiProperty()
	searchParam: string;
}
