import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeckDto, DeckResponseDto, UpdateDeckDto } from './dto/deck.dto';

@Injectable()
export class DeckService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllDecks(userId: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        decks: true,
      },
    });

    if (!user) throw new NotFoundException();

    return user.decks.map((card) => new DeckResponseDto(card));
  }

  async getDeckById(id: string) {
    const deck = await this.prismaService.deck.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        selected: true,
        cards: true,
      },
    });

    if (!deck) throw new NotFoundException();

    return deck;
  }

  async createDeck(userId: string, { name }: CreateDeckDto) {
    const cardExists = await this.prismaService.card.findFirst({
      where: {
        name,
      },
    });

    if (cardExists) throw new ConflictException();

    const card = await this.prismaService.deck.create({
      data: {
        name: name,
        selected: false,
        user_id: userId,
      },
    });

    return new DeckResponseDto(card);
  }

  async updateDeckById(id: string, data: UpdateDeckDto) {
    const updatedCard = await this.prismaService.deck.update({
      where: {
        id,
      },
      data,
    });

    return new DeckResponseDto(updatedCard);
  }

  async deleteDeckById(id: string) {
    await this.prismaService.deck.delete({
      where: {
        id,
      },
    });

    return 'Deck Successfully Deleted';
  }

  async getUserByDeckId(id: string) {
    const deck = await this.prismaService.deck.findUnique({
      where: {
        id,
      },
      select: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!deck) throw new NotFoundException();

    return deck.user;
  }
}
