import { z } from "zod";
import { CardSchema } from "./Card";

export const DeckSchema = z.object({
	id: z.string().cuid(),
	name: z.string().min(1, "Name cannot be empty."),
	selected: z.boolean().default(false),
	cards: CardSchema.array().optional(),
	private: z.boolean(),
});
export type Deck = z.input<typeof DeckSchema>;
