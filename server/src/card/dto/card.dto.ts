import { CardType } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateCardDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    description: string
    
    @IsEnum(CardType)
    @IsNotEmpty()
    cardType: CardType;
}

export class UpdateCardDto {
    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    description?: string
    
    @IsEnum(CardType)
    @IsOptional()
    cardType?: CardType;
}

export class CardResponseDto {
    id: string;
    name: string;
    description: string;
    card_type: CardType;

    constructor(paritial: Partial<CardResponseDto>) {
        this.id = paritial.id;
        this.name = paritial.name;
        this.description = paritial.description;
        this.card_type = paritial.card_type;
      }
}