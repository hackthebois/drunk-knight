import { ApiProperty } from '@nestjs/swagger';
import { Card, Deck } from '@prisma/client';
import {
	IsBoolean,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from 'class-validator';
import { CardResponseDto } from 'src/card/dto/card.dto';

export class CreateDeckDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	@MaxLength(50)
	name: string;
}

export class UpdateDeckDto {
	@IsOptional()
	@IsString()
	@ApiProperty()
	@MaxLength(50)
	name: string;

	@IsOptional()
	@IsBoolean()
	@ApiProperty()
	selected: boolean;

	@IsOptional()
	@IsBoolean()
	@ApiProperty()
	private: boolean;
}

export class DeckResponseDto {
	id: string;
	name: string;
	selected: boolean;
	private: boolean;
	cards: CardResponseDto[];

	constructor(partial: Partial<Deck>, cards?: Card[]) {
		this.id = partial.id;
		this.name = partial.name;
		this.selected = partial.selected;
		this.cards = cards
			? cards.map((card) => new CardResponseDto(card))
			: [];
		this.private = partial.private;
	}
}
