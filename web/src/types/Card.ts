import z from 'zod';

const DateSchema = z.preprocess((arg) => {
	if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
}, z.date());

export const CardSchema = z.object({
	id: z.string().cuid(),
	name: z.string(),
	description: z.string(),
	cardType: z.enum(['CATEGORIES', 'ACTION', 'MEMORY', 'MAJORITY']),
	created_at: DateSchema,
	updated_at: DateSchema,
	deck_id: z.string().cuid(),
});
export type Card = z.infer<typeof CardSchema>;
