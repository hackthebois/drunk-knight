import { CardType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCardDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsEnum(CardType)
	@IsNotEmpty()
	cardType: CardType;
}

export class UpdateCardDto {
	@IsString()
	@IsOptional()
	name?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsEnum(CardType)
	@IsOptional()
	cardType?: CardType;
}

export class CardResponseDto {
	id: string;
	name: string;
	description: string;
	cardType: CardType;

	constructor(partial: any) {
		this.id = partial.id;
		this.name = partial.name;
		this.description = partial.description;
		this.cardType = partial.card_type;
	}
}
