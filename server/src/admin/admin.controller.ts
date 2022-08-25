import { BadRequestException, Body, Controller, Delete, Get, HttpException, Param, Put, Query } from '@nestjs/common';
import { CardType, UserType } from '@prisma/client';
import { UpdateCardDto } from 'src/card/dto/card.dto';
import { UpdateDeckDto } from 'src/deck/dto/deck.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UpdateUserDto } from 'src/user/dtos/user.dto';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    
    constructor(private readonly adminService: AdminService){}

    @Roles(UserType.ADMIN)
    @Get("/users")
    getAllUsers(@Query('usertype') user_type: UserType){
        const filter = user_type in UserType ? { user_type } : undefined;
        return this.adminService.getAllUsers(filter);
    }

    @Roles(UserType.ADMIN)
    @Get("/decks")
    getAllDecks(){
        return this.adminService.getAllDecks();
    }

    @Roles(UserType.ADMIN)
    @Get("/cards")
    getAllCards(@Query('cardtype') card_type?: CardType){
        const filter = card_type in CardType ? { card_type } : undefined;
        return this.adminService.getAllCards(filter);
    }

    @Roles(UserType.ADMIN)
    @Get("/:userId")
    getUserById(@Param("userId") userId: string) {
        return this.adminService.getUser(userId);
    }

    @Roles(UserType.ADMIN)
    @Put("/:userId")
    updatedUserById(@Param("userId") userId: string, @Body() body: UpdateUserDto) {
        if(!body.email && !body.username) throw new BadRequestException();

        return this.adminService.updateUser(userId, body);
    }

    @Roles(UserType.ADMIN)
    @Delete("/:userId")
    deleteUserById(@Param("userId") userId: string) {
        return this.adminService.deleteUser(userId);
    }

    @Roles(UserType.ADMIN)
    @Get("/:userId/deck")
    getUserDecks(@Param("userId") userId: string) {
        return this.adminService.getUserDecks(userId);
    }

    @Roles(UserType.ADMIN)
    @Put("/:userId/deck/:deckId")
    updateUserDeckById(@Param("userId") userId: string, @Param("deckId") deckId: string, @Body() body: UpdateDeckDto) {
        return this.adminService.updateUserDeckById(userId, deckId, body);
    }

    @Roles(UserType.ADMIN)
    @Delete("/:userId/deck/:deckId")
    deleteUserDeckById(@Param("userId") userId: string, @Param("deckId") deckId: string) {
        return this.adminService.deleteUserDeckById(userId, deckId);
    }


    @Roles(UserType.ADMIN)
    @Get("/:userId/deck/:deckid/card")
    getUserCards(@Param("userId") userId: string, @Param("deckId") deckId: string, @Query("cardtype") card_type?: CardType){
        const filter = card_type in CardType ? { card_type } : undefined;
        return this.adminService.getDeckCards(userId,deckId, filter);
    }


    @Roles(UserType.ADMIN)
    @Put("/:userId/deck/:deckId/card/:cardId")
    updateUserCards(@Param("userId") userId : string, @Param("deckId") deckId : string, @Param("cardId") cardId : string, @Body() body: UpdateCardDto){
        return this.adminService.updateDeckCard(userId, deckId, cardId, body);
    }

    @Roles(UserType.ADMIN)
    @Delete("/:userId/deck/:deckId/card/:cardId")
    deleteUserCardById(@Param("userId") userId : string, @Param("deckId") deckId : string, @Param("cardId") cardId : string){
        return this.adminService.deleteDeckCard(userId, deckId, cardId);
    }

}
