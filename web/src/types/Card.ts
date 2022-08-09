import z from "zod";

const CardSchema = z.object({
	id: z.string().cuid(),
	name: z.string(),
	description: z.string(),
	card_type: z.enum(["CATEGORIES", "ACTION", "MEMORY", "MAJORITY"]),
	created_at: z.date(),
	updated_at: z.date(),
	user_id: z.string().cuid(),
});

export type Card = z.infer<typeof CardSchema>;
