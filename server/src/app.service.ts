import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserInfo } from './user/decorators/user.decorator';
import { Card, UserType } from '@prisma/client';

@Injectable()
export class AppService {

  constructor(private readonly prismaService: PrismaService) {}

  getHello(): string {
    return "Welcome To Drunk-Knight";
  }

  async getGameplayCards(user: UserInfo) {
    const gameplayDecks = await this.prismaService.user.findFirst({
      where:{
        user_type: UserType.ADMIN
      },
      select:{
        decks: {
          select:{
            cards: true
          }
        }
      }
    });
    
    const standardCards = gameplayDecks.decks[0].cards;

    if(user && user.name != "__admin"){
      const userCards = await this.prismaService.deck.findFirst({
        where: {
          user_id: user.id,
          selected: true
        },
        select: {
          cards: true
        }
      });
      return [...standardCards, ...userCards.cards];
    }
    return standardCards;
  }
}
