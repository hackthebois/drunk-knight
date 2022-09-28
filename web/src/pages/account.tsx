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

export const UpdateDeckSchema = z.object({
	id: DeckSchema.shape.id,
	name: DeckSchema.shape.name,
	selected: DeckSchema.shape.selected,
});
export type UpdateDeck = z.input<typeof UpdateDeckSchema>;

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

const updateDeck = async ({ id, name, selected }: UpdateDeck) => {
	const accessToken = localStorage.getItem('access_token');

	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck/${id}`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ name, selected }),
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
		onSuccess: (deck) => {
			queryClient.setQueryData<Deck[] | undefined>(['decks'], (old) =>
				old ? [...old, deck] : [],
			),
				queryClient.invalidateQueries(['decks']);
		},
	});
	const updateDeckMutation = useMutation(updateDeck, {
		onSuccess: (deck) =>
			queryClient.setQueryData<Deck[] | undefined>(['decks'], (old) =>
				old
					? old.map((oldDeck) =>
							oldDeck.id === deck.id ? deck : oldDeck,
					  )
					: [],
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
				Email Confirmed: {user?.emailConfirmation ? 'True' : 'False'}
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
					<div className="flex mt-2">
						<div
							key={id}
							onClick={() => router.push(`/deck/${id}`)}
							className="flex-1 item rounded-r-none"
						>
							<p className="flex items-center">{name}</p>
						</div>
						{selected ? (
							<button
								className="btn -mr-2 rounded-l-none"
								onClick={() =>
									updateDeckMutation.mutate({
										name,
										id,
										selected: false,
									})
								}
							>
								Unselect
							</button>
						) : (
							<button
								className="btn -mr-2 rounded-l-none"
								onClick={() =>
									updateDeckMutation.mutate({
										name,
										id,
										selected: true,
									})
								}
							>
								Select
							</button>
						)}
					</div>
				))}
			</>
		</main>
	);
};

export default Account;
