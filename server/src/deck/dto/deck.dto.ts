import { CardType, Deck } from "@prisma/client"
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";


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
    selected: boolean

    constructor(paritial: Partial<Deck>) {
        this.id = paritial.id;
        this.name = paritial.name;
        this.selected = paritial.selected;
      }
}