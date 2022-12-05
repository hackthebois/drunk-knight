import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { z } from "zod";
import { SearchDeck } from "../app/(game)/decks/search/[deckId]/page";
import { env } from "../env/client.mjs";
import { Deck, DeckSchema } from "../types/Deck";

// GET DECKS (GET /deck)
const getDecks = async (token: string) => {
	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck`, {
		method: "GET",
		cache: "no-store",
		next: { revalidate: 0 },
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const data: unknown = await res.json();
	return DeckSchema.array().parse(data);
};
export const useDecks = (token: string) =>
	useQuery(["decks"], () => getDecks(token));

// CREATE DECK (POST /deck/create)
export const CreateDeckSchema = z.object({
	name: DeckSchema.shape.name,
});
export type CreateDeck = z.input<typeof CreateDeckSchema>;
const createDeck = async ({
	deck: { name },
	token,
}: {
	deck: CreateDeck;
	token: string;
}) => {
	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck/create`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ name }),
	});
	const data: unknown = await res.json();
	return DeckSchema.parse(data);
};
export const useCreateDeck = () => {
	const queryClient = useQueryClient();
	return useMutation(createDeck, {
		onMutate: async (newDeck) => {
			await queryClient.cancelQueries({
				queryKey: ["decks"],
			});
			const previousDecks = queryClient.getQueryData<Deck[]>(["decks"]);
			queryClient.setQueryData<Deck[] | undefined>(["decks"], (old) =>
				old
					? [
							...old,
							{
								id: "555",
								cards: [],
								selected: false,
								name: newDeck.deck.name,
							},
					  ]
					: [],
			);
			return { previousDecks };
		},
		onError: (err, newTodo, context) => {
			queryClient.setQueryData(["decks"], context?.previousDecks);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["decks"] });
		},
	});
};

const copyDeck = async ({
	token,
	deckId,
}: {
	token: string;
	deck: SearchDeck;
	deckId: string;
}) => {
	await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/search/deck/${deckId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
};
export const useCopyDeck = () => {
	const queryClient = useQueryClient();
	const router = useRouter();
	return useMutation(copyDeck, {
		onMutate: async ({ deck, deckId }) => {
			await queryClient.cancelQueries({
				queryKey: ["decks"],
			});
			const previousDecks = queryClient.getQueryData<Deck[]>(["decks"]);
			queryClient.setQueryData<Deck[] | undefined>(["decks"], (old) =>
				old
					? [
							...old,
							{
								id: deckId,
								cards: [],
								selected: false,
								name: deck.name,
							},
					  ]
					: [],
			);
			router.push("/decks");
			return { previousDecks };
		},
		onError: (err, newTodo, context) => {
			queryClient.setQueryData(["decks"], context?.previousDecks);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["decks"] });
		},
	});
};

// UPDATE DECK (PUT /deck/:id)
export const UpdateDeckSchema = z.object({
	id: DeckSchema.shape.id,
	name: DeckSchema.shape.name,
	selected: DeckSchema.shape.selected,
});
export type UpdateDeck = z.input<typeof UpdateDeckSchema>;
const updateDeck = async ({
	updateDeck: { id, name, selected },
	token,
}: {
	updateDeck: UpdateDeck;
	token: string;
}) => {
	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck/${id}`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ name, selected }),
	});
	const data: unknown = await res.json();
	return DeckSchema.parse(data);
};
export const useUpdateDeck = () => {
	const queryClient = useQueryClient();
	return useMutation(updateDeck, {
		onMutate: async ({ updateDeck: newDeck }) => {
			await queryClient.cancelQueries({
				queryKey: ["decks"],
			});
			const previousDecks = queryClient.getQueryData<Deck[]>(["decks"]);
			queryClient.setQueryData<Deck[] | undefined>(["decks"], (old) =>
				old
					? old.map((oldDeck) =>
							oldDeck.id === newDeck.id ? newDeck : oldDeck,
					  )
					: [],
			);
			return { previousDecks };
		},
		onSuccess: () => {
			queryClient.refetchQueries(["play"]);
		},
		onError: (err, newTodo, context) => {
			queryClient.setQueryData(["decks"], context?.previousDecks);
		},
		onSettled: () => {
			queryClient.invalidateQueries(["decks"]);
		},
	});
};

// DELETE DECK (DELETE /deck/:id)
const deleteDeck = async ({ token, id }: { id: string; token: string }) => {
	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck/${id}`, {
		method: "DELETE",
		body: JSON.stringify({ id }),
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const data: unknown = await res.json();
	return DeckSchema.parse(data);
};
export const useDeleteDeck = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation(deleteDeck, {
		onMutate: async ({ id }) => {
			await queryClient.cancelQueries({
				queryKey: ["decks"],
			});
			const previousDecks = queryClient.getQueryData<Deck[]>(["decks"]);
			queryClient.setQueryData<Deck[] | undefined>(["decks"], (old) =>
				old ? old.filter((deck) => deck.id !== id) : [],
			);
			router.push("/decks");
			return { previousDecks };
		},
		onSuccess: ({ selected }) => {
			if (selected) queryClient.refetchQueries(["play"]);
		},
		onError: (err, newTodo, context) => {
			queryClient.setQueryData(["decks"], context?.previousDecks);
		},
		onSettled: () => {
			queryClient.invalidateQueries(["decks"]);
		},
	});
};
