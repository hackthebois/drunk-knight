import { z } from 'zod';
import { CardSchema } from './Card';

export const DeckSchema = z.object({
	id: z.string().cuid(),
	name: z.string(),
	selected: z.boolean().default(false),
	cards: CardSchema.array().optional(),
});
export type Deck = z.input<typeof DeckSchema>;
