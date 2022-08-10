import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CardType } from '@prisma/client';
import { CardService } from './card.service';

@Controller('card')
export class CardController {

    constructor(private readonly cardService: CardService) { }

    @Get()
    getAllCards(@Query('cardtype') card_type?: CardType) {

        const filter = card_type in CardType ? { card_type } : undefined;

        return this.cardService.getAllCards(filter);
    }

    @Get("/:id")
    getCardById(@Param(":id") id: string) {
        return this.cardService.getCardById(id);
    }
}
