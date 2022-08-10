import z from "zod";

export const CardSchema = z.object({
	id: z.string().cuid(),
	name: z.string(),
	description: z.string(),
	card_type: z.enum(["CATEGORIES", "ACTION", "MEMORY", "MAJORITY"]),
});

export type Card = z.infer<typeof CardSchema>;
