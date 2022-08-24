import { BadRequestException, Body, Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { CardType, UserType } from '@prisma/client';
import { UpdateCardDto } from 'src/card/dto/card.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UpdateUserDto } from 'src/user/dtos/user.dto';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    
    constructor(private readonly adminService: AdminService){}

    // @Roles(UserType.ADMIN)
    // @Get()
    // getAllUsers(@Query('usertype') user_type: UserType){
    //     const filter = user_type in UserType ? { user_type } : undefined;
    //     return this.adminService.getAllUsers(filter);
    // }

    // @Roles(UserType.ADMIN)
    // @Get("/:id")
    // getUserById(@Param("id") id: string) {
    //     return this.adminService.getUser(id);
    // }

    // @Roles(UserType.ADMIN)
    // @Put("/:id")
    // updatedUserById(@Param("id") id: string, @Body() body: UpdateUserDto) {
    //     if(!body.email && !body.username) throw new BadRequestException();

    //     return this.adminService.updateUser(id, body);
    // }

    // @Roles(UserType.ADMIN)
    // @Delete("/:id")
    // deleteUserById(@Param("id") id: string) {
    //     return this.adminService.deleteUser(id);
    // }


    // @Roles(UserType.ADMIN)
    // @Get("/:id/card")
    // getUserCards(@Param("id") id : string, @Query("cardtype") card_type?: CardType){
    //     const filter = card_type in CardType ? { card_type } : undefined;
    //     return this.adminService.getUserCards(id, filter);
    // }

    // @Roles(UserType.ADMIN)
    // @Get("/:userId/card/:cardId")
    // getUserCardById(@Param("userId") userId : string, @Param("cardId") cardId : string){
    //     return this.adminService.getUserCardById(userId, cardId);
    // }


    // @Roles(UserType.ADMIN)
    // @Put("/:userId/card/:cardId")
    // updateUserCards(@Param("userId") userId : string, @Param("cardId") cardId : string, @Body() body: UpdateCardDto){
    //     return this.adminService.updateUserCard(userId, cardId, body);
    // }

    // @Roles(UserType.ADMIN)
    // @Delete("/:userId/card/:cardId")
    // deleteUserCardById(@Param("userId") userId : string, @Param("cardId") cardId : string){
    //     return this.adminService.deleteUserCardById(userId, cardId);
    // }

}
