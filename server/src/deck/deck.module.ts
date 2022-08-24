import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DeckController } from './deck.controller';
import { DeckService } from './deck.service';

@Module({
  imports: [PrismaModule],
  controllers: [DeckController],
  providers: [DeckService]
})
export class DeckModule {}
