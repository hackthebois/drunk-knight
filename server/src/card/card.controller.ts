import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CardType } from '@prisma/client';
import { CardService } from './card.service';
import { CreateCardDto, UpdateCardDto } from './dto/card.dto';

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

    @Post("/create")
    createCard(@Body() body: CreateCardDto) {
        return this.cardService.createCard(body);
    }

    @Put("/:id")
    updateCardById(@Param("id") id: string, @Body() body: UpdateCardDto){
        return this.cardService.updateCardById(id, body);
    }

    @Delete("/:id")
    deleteCardById(@Param(":id") id: string){
        return this.cardService.deleteCardById(id);
    }
}
