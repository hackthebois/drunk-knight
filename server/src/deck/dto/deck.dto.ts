import { Card, Deck } from '@prisma/client';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CardResponseDto } from 'src/card/dto/card.dto';

export class CreateDeckDto {
	@IsNotEmpty()
	@IsString()
	name: string;
}

export class UpdateDeckDto {
	@IsOptional()
	@IsString()
	name: string;

	@IsOptional()
	@IsBoolean()
	selected: boolean;
}

export class DeckResponseDto {
	id: string;
	name: string;
	selected: boolean;
	cards: CardResponseDto[];

	constructor(partial: Partial<Deck>, cards?: Card[]) {
		this.id = partial.id;
		this.name = partial.name;
		this.selected = partial.selected;
		this.cards = cards
			? cards.map((card) => new CardResponseDto(card))
			: [];
	}
}
