import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { env } from '../env/client.mjs';
import { CardSchema } from '../types/Card';
import { Deck, DeckSchema } from '../types/Deck';

// CREATE CARD (POST /deck/:deckId/card/create)
export const CreateCardSchema = z.object({
	name: CardSchema.shape.name,
	description: CardSchema.shape.description,
	cardType: CardSchema.shape.cardType,
	deckId: DeckSchema.shape.id,
});
export type CreateCard = z.infer<typeof CreateCardSchema>;
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
export const useCreateCard = () => {
	const queryClient = useQueryClient();
	return useMutation(createCard, {
		onSuccess: (card, { deckId }) =>
			queryClient.setQueryData<Deck | undefined>(
				['deck', deckId],
				(old) =>
					old && old.cards
						? { ...old, cards: [...old.cards, card] }
						: old,
			),
	});
};

// UPDATE CARD (PUT /deck/:deckId/card/:id)
export const UpdateCardSchema = z.object({
	id: CardSchema.shape.id,
	name: CardSchema.shape.name,
	description: CardSchema.shape.description,
	cardType: CardSchema.shape.cardType,
	deckId: DeckSchema.shape.id,
});
export type UpdateCard = z.infer<typeof UpdateCardSchema>;
export const updateCard = async ({
	id,
	name,
	description,
	cardType,
	deckId,
}: UpdateCard) => {
	const accessToken = localStorage.getItem('access_token');

	const res = await fetch(
		`${env.NEXT_PUBLIC_SERVER_URL}/deck/${deckId}/card/${id}`,
		{
			method: 'PUT',
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
export const useUpdateCard = () => {
	const queryClient = useQueryClient();
	return useMutation(updateCard, {
		onSuccess: (card, { deckId }) =>
			queryClient.setQueryData<Deck | undefined>(
				['deck', deckId],
				(old) =>
					old && old.cards
						? {
								...old,
								cards: old.cards.map((oldCard) =>
									oldCard.id === card.id ? card : oldCard,
								),
						  }
						: old,
			),
	});
};
