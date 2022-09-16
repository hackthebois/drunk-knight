import { Injectable } from '@nestjs/common';
import { CardType, UserType } from '@prisma/client';
import { CardResponseDto } from 'src/card/dto/card.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchDto } from './dtos/search.dto';

class DeckData {
  name: string;
  description: string;
  card_type: CardType;
  deck_id: string;

  constructor(
    name: string,
    description: string,
    card_type: CardType,
    deck_id: string,
  ) {
    this.name = name;
    this.description = description;
    this.card_type = card_type;
    this.deck_id = deck_id;
  }
}

@Injectable()
export class SearchService {
  constructor(private readonly prismaService: PrismaService) {}

  async searchDecks(body: SearchDto) {
    return await this.prismaService.deck.findMany({
      where: {
        name: {
          contains: body.searchParam,
        },
        user: {
          user_type: UserType.DEFAULT,
        },
      },
      select: {
        id: true,
        name: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async getDeckAndCards(deckId: string) {
    const deck = await this.prismaService.deck.findFirst({
      where: {
        id: deckId,
      },
      select: {
        name: true,
        cards: true,
      },
    });
    return {
      name: deck.name,
      cards: deck.cards.map((card) => new CardResponseDto(card)),
    };
  }

  async copyDeck(deckId: string, userId: string) {
    const deck = await this.getDeckAndCards(deckId);

    const userDeck = await this.prismaService.deck.create({
      data: {
        name: deck.name,
        selected: false,
        user_id: userId,
      },
    });

    const data = deck.cards.map((card) => ({
      name: card.name,
      description: card.description,
      card_type: card.cardType,
      deck_id: userDeck.id,
    }));

    await this.prismaService.card.createMany({
      data: data,
    });
  }
}
