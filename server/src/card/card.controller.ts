import { Body, Controller, Delete, Get, Param, Post, Put, Query, UnauthorizedException} from '@nestjs/common';
import { CardType, UserType } from '@prisma/client';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { CardService } from './card.service';
import { CreateCardDto, UpdateCardDto } from './dto/card.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('/account/:userId/deck/:deckId/card')
export class CardController {

    constructor(private readonly cardService: CardService) { }

    @Roles(UserType.DEFAULT, UserType.ADMIN)
    @Get()
    getAllCards(@Param("userId") userId: string, @Param("deckId") deckId: string, @Query('cardtype') card_type?: CardType) {
        const filter = card_type in CardType ? { card_type } : undefined;
        return this.cardService.getAllCards(userId, deckId, filter);
    }

    @Roles(UserType.DEFAULT, UserType.ADMIN)
    @Get("/:id")
    async getCardById(@Param("userId") userId: string, @Param("deckId") deckId: string, @Param(":id") cardId: string) {
        return this.cardService.getCardById(userId, deckId, cardId);
    }

    @Roles(UserType.DEFAULT, UserType.ADMIN)
    @Post("/create")
    async createCard(@Param("userId") userId: string, @Param("deckId") deckId: string, @Body() body: CreateCardDto, @User() user: UserInfo) {
        if(userId !== user.id) throw new UnauthorizedException();
        const deckOwner = await this.cardService.getUserByDeckId(deckId);
        if(userId !== deckOwner.id) throw new UnauthorizedException();

        return this.cardService.createCard(deckId, body);
    }

    @Roles(UserType.DEFAULT, UserType.ADMIN)
    @Put("/:id")
    async updateCardById(
        @Param("userId") userId: string, 
        @Param("deckId") deckId: string, 
        @Param("id") cardId: string, 
        @Body() body: UpdateCardDto, 
        @User() user: UserInfo){
        const deck = await this.cardService.getDeckByCardId(cardId);
        if(deck.user_id !== user.id || deck.id !== deckId || user.id !== userId) throw new UnauthorizedException();

        return this.cardService.updateCardById(cardId, body);
    }

    @Roles(UserType.DEFAULT, UserType.ADMIN)
    @Delete("/:id")
    async deleteCardById(
        @Param("userId") userId: string, 
        @Param("deckId") deckId: string, 
        @Param("id") cardId: string, 
        @Body() body: UpdateCardDto, 
        @User() user: UserInfo){
        const deck = await this.cardService.getDeckByCardId(cardId);
        if(deck.user_id !== user.id || deck.id !== deckId || user.id !== userId) throw new UnauthorizedException();

        return this.cardService.deleteCardById(cardId);
    }
}
