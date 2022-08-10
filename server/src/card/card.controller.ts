import { Body, Controller, Delete, Get, Param, Post, Put, Query, UnauthorizedException} from '@nestjs/common';
import { CardType, UserType } from '@prisma/client';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { CardService } from './card.service';
import { CreateCardDto, UpdateCardDto } from './dto/card.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('/account/card')
export class CardController {

    constructor(private readonly cardService: CardService) { }

    @Roles(UserType.DEFAULT, UserType.ADMIN)
    @Get()
    getAllCards(@User() user: UserInfo, @Query('cardtype') card_type?: CardType) {
        const filter = card_type in CardType ? { card_type } : undefined;
        return this.cardService.getAllCards(filter, user.id);
    }

    @Roles(UserType.DEFAULT, UserType.ADMIN)
    @Get("/:id")
    async getCardById(@Param(":id") id: string, @User() user: UserInfo) {
        const cardOwner = await this.cardService.getUserByCardId(id);
        if(cardOwner.id !== user.id) throw new UnauthorizedException();

        return this.cardService.getCardById(id);
    }

    @Roles(UserType.DEFAULT, UserType.ADMIN)
    @Post("/create")
    createCard(@Body() body: CreateCardDto, @User() user: UserInfo) {
        return this.cardService.createCard(body, user.id);
    }

    @Roles(UserType.DEFAULT, UserType.ADMIN)
    @Put("/:id")
    async updateCardById(@Param("id") id: string, @Body() body: UpdateCardDto, @User() user: UserInfo){
        const cardOwner = await this.cardService.getUserByCardId(id);
        if(cardOwner.id !== user.id) throw new UnauthorizedException();

        return this.cardService.updateCardById(id, body);
    }

    @Roles(UserType.DEFAULT, UserType.ADMIN)
    @Delete("/:id")
    async deleteCardById(@Param(":id") id: string, @User() user: UserInfo){
        const cardOwner = await this.cardService.getUserByCardId(id);
        if(cardOwner.id !== user.id) throw new UnauthorizedException();

        return this.cardService.deleteCardById(id);
    }
}
