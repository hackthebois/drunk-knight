import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { env } from '../env/client.mjs';

export const UserSchema = z.object({
	id: z.string().cuid(),
	email: z.string().email(),
	username: z.string(),
	emailConfirmation: z.boolean().default(false),
});
export type User = z.input<typeof UserSchema>;
const getUserReq = async () => {
	const accessToken = localStorage.getItem('access_token');

	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/account`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const data: unknown = await res.json();
	return UserSchema.parse(data);
};

export const UpdateUserSchema = z.object({
	email: z.string().email(),
	username: z
		.string()
		.min(4, 'Username must contain at least 4 character(s)'),
});
export type UpdateUser = z.input<typeof UpdateUserSchema>;
const updateUserReq = async ({ username, email }: UpdateUser) => {
	const accessToken = localStorage.getItem('access_token');

	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/account`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			username,
			email,
		}),
	});
	const data: unknown = await res.json();
	return UserSchema.parse(data);
};

const useAuth = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	const findUser = useQuery(['user'], getUserReq, {
		refetchOnWindowFocus: false,
	});

	const update = useMutation(updateUserReq, {
		onSuccess: () => queryClient.invalidateQueries(['user']),
	});

	const signout = () => {
		localStorage.setItem('access_token', '');
		queryClient.resetQueries(['user']);
		router.push('/');
	};

	return { findUser, signout, update };
};

export default useAuth;
