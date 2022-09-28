import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { env } from '../../env/client.mjs';
import { CardSchema } from '../../types/Card';
import { Deck, DeckSchema } from '../../types/Deck';

export const CreateCardSchema = z.object({
	name: CardSchema.shape.name,
	description: CardSchema.shape.description,
	cardType: CardSchema.shape.cardType,
	deckId: DeckSchema.shape.id,
});
export type CreateCard = z.infer<typeof CreateCardSchema>;

export const UpdateCardSchema = z.object({
	name: CardSchema.shape.name.optional(),
	description: CardSchema.shape.description.optional(),
	cardType: CardSchema.shape.cardType.optional(),
});
export type UpdateCard = z.infer<typeof UpdateCardSchema>;

const getDeck = async (id: string) => {
	const accessToken = localStorage.getItem('access_token');

	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck/${id}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const data: unknown = await res.json();
	return DeckSchema.parse(data);
};

const deleteDeck = async (id: string) => {
	const accessToken = localStorage.getItem('access_token');

	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck/${id}`, {
		method: 'DELETE',
		body: JSON.stringify({ id }),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const data: unknown = await res.json();
	return DeckSchema.parse(data);
};

const createCard = async ({
	name,
	description,
	cardType,
	deckId,
}: CreateCard) => {
	const accessToken = localStorage.getItem('access_token');

	const res = await fetch(
		`${env.NEXT_PUBLIC_SERVER_URL}/deck/${deckId}/card/create`,
		{
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({ name, description, cardType }),
		},
	);
	const data: unknown = await res.json();
	return CardSchema.parse(data);
};

const DeckPage = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	const deckId = typeof router.query.id === 'string' ? router.query.id : '';

	const { data: deck, error } = useQuery(['deck', deckId], () =>
		getDeck(deckId),
	);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<CreateCard>({
		defaultValues: {
			name: '',
			description: '',
			cardType: 'ACTION',
			deckId,
		},
		resolver: zodResolver(CreateCardSchema),
	});

	useEffect(() => {
		setValue('deckId', deckId);
	}, [deckId]);

	const createCardMutation = useMutation(createCard, {
		onSuccess: (card) =>
			queryClient.setQueryData<Deck | undefined>(
				['deck', deckId],
				(old) =>
					old && old.cards
						? { ...old, cards: [...old.cards, card] }
						: old,
			),
	});

	const deleteDeckMutation = useMutation(deleteDeck, {
		onSuccess: ({ id }) => {
			queryClient.setQueryData<Deck[] | undefined>(['decks'], (old) =>
				old ? old.filter((deck) => deck.id !== id) : [],
			);
			router.push('/account');
		},
	});

	const onCreateCard = (data: CreateCard) => {
		createCardMutation.mutate(data);
	};

	return (
		<main className="flex flex-col justify-between">
			<div className="background">
				{errors.cardType && <div>{errors.cardType.message}</div>}
				{errors.name && <div>{errors.name.message}</div>}
				{errors.description && <div>{errors.description.message}</div>}
				{deck && <h2 className="text-2xl mb-8">{deck.name}</h2>}
				<form
					className="form flex flex-col md:flex-row mb-6"
					onSubmit={handleSubmit(onCreateCard)}
				>
					{errors.name && (
						<p className="ebtn">{errors.name.message}</p>
					)}
					<input
						type="text"
						placeholder="Card Name"
						className="flex-1 mb-2 md:mr-2 md:mb-0"
						{...register('name')}
					/>
					<input
						type="text"
						placeholder="Card Description"
						className="flex-1 md:mr-2 mb-2 md:mb-0"
						{...register('description')}
					/>
					<input type="submit" value="Add New" />
				</form>
				{deck &&
					deck.cards &&
					deck.cards.map(({ id, name, description }) => (
						<div
							key={id}
							className="item cursor-default mt-4 flex flex-col justify-between align-center
							hover:bg-lightbackground hover:bg-opacity-100
							"
						>
							<p className="flex items-center text-lg mb-2">
								{name}
							</p>
							<p className="flex items-center opacity-70">
								{description}
							</p>
						</div>
					))}
			</div>
			<button
				className="ebtn mt-8"
				onClick={() => deleteDeckMutation.mutate(deckId)}
			>
				Delete Deck
			</button>
		</main>
	);
};

export default DeckPage;
