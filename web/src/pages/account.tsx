import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router.js';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { env } from '../env/client.mjs';
import useAuth from '../hooks/useAuth';
import { Deck, DeckSchema } from '../types/Deck';

export const CreateDeckSchema = z.object({
	name: DeckSchema.shape.name,
});
export type CreateDeck = z.input<typeof CreateDeckSchema>;

const getDecks = async () => {
	const accessToken = localStorage.getItem('access_token');

	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const data: unknown = await res.json();
	return DeckSchema.array().parse(data);
};

const createDeck = async ({ name }: CreateDeck) => {
	const accessToken = localStorage.getItem('access_token');

	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck/create`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ name }),
	});
	const data: unknown = await res.json();
	return DeckSchema.parse(data);
};

const Account = () => {
	const queryClient = useQueryClient();
	const { findUser, signout } = useAuth();
	const { data: user } = findUser;
	const { data: decks } = useQuery(['decks'], getDecks);
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateDeck>({
		resolver: zodResolver(CreateDeckSchema),
	});
	const createDeckMutation = useMutation(createDeck, {
		onSuccess: (deck) =>
			queryClient.setQueryData<Deck[] | undefined>(['decks'], (old) =>
				old ? [...old, deck] : [],
			),
	});

	const onCreateDeck = ({ name }: CreateDeck) => {
		createDeckMutation.mutate({ name });
	};

	return (
		<main>
			<h2 className="text-2xl my-3">Profile</h2>
			<p className="my-2">{user?.email}</p>
			<p className="my-2">{user?.username}</p>
			<p className="my-2">
				Email Confirmed: {user?.email_confirmation ? 'True' : 'False'}
			</p>
			<button className="gbtn my-3" onClick={() => signout()}>
				Sign out
			</button>
			<h2 className="text-2xl my-3">Decks</h2>
			<form className="flex" onSubmit={handleSubmit(onCreateDeck)}>
				{errors.name && <p className="ebtn">{errors.name.message}</p>}
				<input
					type="text"
					placeholder="Deck Name"
					className="input mr-2"
					{...register('name')}
				/>
				<input type="submit" value="Add New" className="gbtn" />
			</form>
			<>
				{decks?.map(({ name, id, selected }) => (
					<div
						key={id}
						onClick={() => router.push(`/deck/${id}`)}
						className="item mt-4 flex flex-row justify-between align-center"
					>
						<p className="flex items-center">{name}</p>
						{selected ? (
							<button>Unselect</button>
						) : (
							<button className="btn -mr-2">Select</button>
						)}
					</div>
				))}
			</>
		</main>
	);
};

export default Account;
