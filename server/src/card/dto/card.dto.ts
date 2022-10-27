import { Card, CardType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
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
	name?: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	description?: string;

	@IsEnum(CardType)
	@IsOptional()
	@ApiProperty({ enum: CardType })
	card_type?: CardType;
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
		this.cardType = partial.card_type;
	}
}
