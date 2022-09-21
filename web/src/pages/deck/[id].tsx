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
	console.log(data);
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
	console.log(error);

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

	const onCreateCard = (data: CreateCard) => {
		createCardMutation.mutate(data);
	};

	return (
		<main>
			{errors.cardType && <div>{errors.cardType.message}</div>}
			{errors.name && <div>{errors.name.message}</div>}
			{errors.description && <div>{errors.description.message}</div>}
			{deck && <h2 className="text-2xl my-3">{deck.name}</h2>}
			<form className="flex" onSubmit={handleSubmit(onCreateCard)}>
				{errors.name && <p className="ebtn">{errors.name.message}</p>}
				<input
					type="text"
					placeholder="Card name..."
					className="input mr-2"
					{...register('name')}
				/>
				<input
					type="text"
					placeholder="Card description..."
					className="input mr-2"
					{...register('description')}
				/>
				<input type="submit" value="Add New" className="gbtn" />
			</form>
			<>
				{deck &&
					deck.cards &&
					deck.cards.map(({ id, name, description }) => (
						<div
							key={id}
							className="item mt-4 flex flex-row justify-between align-center"
						>
							<p className="flex items-center">{name}</p>
							<p className="flex items-center">{description}</p>
						</div>
					))}
			</>
		</main>
	);
};

export default DeckPage;
