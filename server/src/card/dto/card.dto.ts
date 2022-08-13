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
    cardType: CardType;

    constructor(paritial: any) {
        this.id = paritial.id;
        this.name = paritial.name;
        this.description = paritial.description;
        this.cardType = paritial.card_type;
      }
}