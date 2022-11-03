import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { env } from "../env/client.mjs";
import { Deck, DeckSchema } from "../types/Deck";

// GET DECKS (GET /deck)

const getDecks = async () => {
	const accessToken = localStorage.getItem("access_token");

	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const data: unknown = await res.json();
	return DeckSchema.array().parse(data);
};
export const useDecks = () => useQuery(["decks"], getDecks);

const getDeck = async (id: string) => {
	const accessToken = localStorage.getItem("access_token");

	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck/${id}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const data: unknown = await res.json();
	return DeckSchema.parse(data);
};
export const useDeck = (id: string) =>
	useQuery(["deck", id], () => getDeck(id));

// CREATE DECK (POST /deck/create)
export const CreateDeckSchema = z.object({
	name: DeckSchema.shape.name,
});
export type CreateDeck = z.input<typeof CreateDeckSchema>;
const createDeck = async ({ name }: CreateDeck) => {
	const accessToken = localStorage.getItem("access_token");

	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck/create`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ name }),
	});
	const data: unknown = await res.json();
	return DeckSchema.parse(data);
};
export const useCreateDeck = () => {
	const queryClient = useQueryClient();
	return useMutation(createDeck, {
		onSuccess: (deck) => {
			queryClient.setQueryData<Deck[] | undefined>(["decks"], (old) =>
				old ? [...old, deck] : [],
			),
				queryClient.invalidateQueries(["decks"]);
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
const updateDeck = async ({ id, name, selected }: UpdateDeck) => {
	const accessToken = localStorage.getItem("access_token");

	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck/${id}`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ name, selected }),
	});
	const data: unknown = await res.json();
	return DeckSchema.parse(data);
};
export const useUpdateDeck = () => {
	const queryClient = useQueryClient();
	return useMutation(updateDeck, {
		onSuccess: (deck) =>
			queryClient.setQueryData<Deck[] | undefined>(["decks"], (old) =>
				old
					? old.map((oldDeck) =>
							oldDeck.id === deck.id ? deck : oldDeck,
					  )
					: [],
			),
	});
};

// DELETE DECK (DELETE /deck/:id)
const deleteDeck = async (id: string) => {
	const accessToken = localStorage.getItem("access_token");

	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck/${id}`, {
		method: "DELETE",
		body: JSON.stringify({ id }),
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const data: unknown = await res.json();
	return DeckSchema.parse(data);
};
export const useDeleteDeck = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation(deleteDeck, {
		onSuccess: ({ id }) => {
			queryClient.setQueryData<Deck[] | undefined>(["decks"], (old) =>
				old ? old.filter((deck) => deck.id !== id) : [],
			);
			router.push("/account");
		},
	});
};
