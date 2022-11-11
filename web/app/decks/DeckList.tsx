"use client";

import { useQuery } from "@tanstack/react-query";
import { env } from "../../env/client.mjs";
import { Deck, DeckSchema } from "../../types/Deck";
import DeckItem from "./DeckItem";

type Props = {
	decks: Deck[];
};

const getDecks = async () => {
	const token = localStorage.getItem("accessToken");
	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const data: unknown = await res.json();
	return DeckSchema.array().parse(data);
};

const DeckList = ({ decks }: Props) => {
	const { data } = useQuery({
		queryKey: ["decks"],
		queryFn: getDecks,
		initialData: decks,
	});

	return (
		<>
			{data.map((deck) => (
				<DeckItem key={deck.id} deck={deck} />
			))}
		</>
	);
};

export default DeckList;
