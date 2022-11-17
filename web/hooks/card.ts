import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation.js";
import { z } from "zod";
import { env } from "../env/client.mjs";
import { CardSchema } from "../types/Card";
import { Deck, DeckSchema } from "../types/Deck";

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
	const accessToken = localStorage.getItem("accessToken");

	const res = await fetch(
		`${env.NEXT_PUBLIC_SERVER_URL}/deck/${deckId}/card/create`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({ name, description, cardType }),
		},
	);
	const data: unknown = await res.json();
	return CardSchema.parse(data);
};
export const useCreateCard = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	return useMutation(createCard, {
		onMutate: async ({ name, deckId, description, cardType }) => {
			await queryClient.cancelQueries({
				queryKey: ["deck", deckId],
			});
			const previousDeck = queryClient.getQueryData<Deck>([
				"deck",
				deckId,
			]);
			queryClient.setQueryData<Deck | undefined>(
				["deck", deckId],
				(old) =>
					old && old.cards
						? {
								...old,
								cards: [
									...old.cards,
									{ name, description, cardType, id: "555" },
								],
						  }
						: old,
			);
			return { previousDeck };
		},
		onError: (err, { deckId }, context) => {
			queryClient.setQueryData(["deck", deckId], context?.previousDeck);
		},
		onSettled: () => {
			router.refresh();
		},
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
	const accessToken = localStorage.getItem("accessToken");

	const res = await fetch(
		`${env.NEXT_PUBLIC_SERVER_URL}/deck/${deckId}/card/${id}`,
		{
			method: "PUT",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
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
	const router = useRouter();
	return useMutation(updateCard, {
		onMutate: async ({ id, name, deckId, description, cardType }) => {
			await queryClient.cancelQueries({
				queryKey: ["deck", deckId],
			});
			const previousDeck = queryClient.getQueryData<Deck>([
				"deck",
				deckId,
			]);
			queryClient.setQueryData<Deck | undefined>(
				["deck", deckId],
				(old) =>
					old && old.cards
						? {
								...old,
								cards: old.cards.map((oldCard) =>
									oldCard.id === id
										? { id, name, cardType, description }
										: oldCard,
								),
						  }
						: old,
			);
			return { previousDeck };
		},
		onError: (err, { deckId }, context) => {
			queryClient.setQueryData(["deck", deckId], context?.previousDeck);
		},
		onSettled: () => {
			router.refresh();
		},
	});
};

// DELETE CARD (DELETE /deck/:deckId/card/:id)
export const DeleteCardSchema = z.object({
	id: CardSchema.shape.id,
	deckId: DeckSchema.shape.id,
});
export type DeleteCard = z.infer<typeof DeleteCardSchema>;
const deleteCard = async ({ id, deckId }: DeleteCard) => {
	const accessToken = localStorage.getItem("accessToken");

	const res = await fetch(
		`${env.NEXT_PUBLIC_SERVER_URL}/deck/${deckId}/card/${id}`,
		{
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		},
	);
	const data: unknown = await res.json();
	return CardSchema.parse(data);
};
export const useDeleteCard = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation(deleteCard, {
		onMutate: async ({ id, deckId }) => {
			await queryClient.cancelQueries({
				queryKey: ["deck", deckId],
			});
			const previousDeck = queryClient.getQueryData<Deck>([
				"deck",
				deckId,
			]);
			queryClient.setQueryData<Deck | undefined>(
				["deck", deckId],
				(old) =>
					old && old.cards
						? {
								...old,
								cards: old.cards.filter(
									(oldCard) => oldCard.id !== id,
								),
						  }
						: old,
			);
			return { previousDeck };
		},
		onError: (err, { deckId }, context) => {
			queryClient.setQueryData(["deck", deckId], context?.previousDeck);
		},
		onSettled: () => {
			router.refresh();
		},
	});
};
