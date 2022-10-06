import { z } from 'zod';

export const UserSchema = z.object({
	id: z.string().cuid(),
	email: z.string().email(),
	username: z.string(),
	emailConfirmation: z.boolean().default(false),
});
export type User = z.input<typeof UserSchema>;

export const UpdateUserSchema = z.object({
	email: z.string().email(),
	username: z
		.string()
		.min(4, 'Username must contain at least 4 character(s)'),
});
export type UpdateUser = z.input<typeof UpdateUserSchema>;
