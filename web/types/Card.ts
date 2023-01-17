import z from "zod";

export const cardTypes = ["CATEGORIES", "ACTION", "MEMORY", "MAJORITY"];

export const CardSchema = z.object({
	id: z.string().cuid(),
	name: z
		.string()
		.min(1, "Name cannot be empty.")
		.max(50, "Name cannot be more than 50 characters"),
	description: z
		.string()
		.min(1, "Description cannot be empty.")
		.max(300, "Description cannot be more than 300 characters"),
	cardType: z.enum(["CATEGORIES", "ACTION", "MEMORY", "MAJORITY"]),
});
export type Card = z.infer<typeof CardSchema>;
