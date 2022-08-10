import { CardType } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsString } from "class-validator";


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

export class CardResponseDto {
    id: string;
    name: string;
    description: string;
    card_type: string;

    constructor(paritial: Partial<CreateCardDto>) {
        Object.assign(this, paritial);
      }
}