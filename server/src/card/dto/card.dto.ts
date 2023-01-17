import { Card, CardType } from '@prisma/client';
import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

export class CreateCardDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	@MaxLength(50)
	name: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	@MaxLength(300)
	description: string;

	@IsEnum(CardType)
	@IsNotEmpty()
	@ApiProperty({ enum: CardType })
	cardType: CardType;
}

export class UpdateCardDto {
	@IsString()
	@IsOptional()
	@ApiProperty()
	@MaxLength(50)
	name?: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	@MaxLength(300)
	description?: string;

	@IsEnum(CardType)
	@IsOptional()
	@ApiProperty({ enum: CardType, name: 'cardType' })
	cardType?: CardType;
}

export class CardResponseDto {
	id: string;
	name: string;
	description: string;
	cardType: CardType;

	constructor(partial: Card) {
		this.id = partial.id;
		this.name = partial.name;
		this.description = partial.description;
		this.cardType = partial.cardType;
	}
}
