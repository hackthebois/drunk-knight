"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaPause, FaPlay } from "react-icons/fa";
import { env } from "../../env/client.mjs";
import { useUpdateDeck } from "../../hooks/deck";
import { Deck, DeckSchema } from "../../types/Deck";

const getDecks = async (token: string) => {
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

type Props = {
	deck: Deck;
};

const DeckItem = ({ deck: { id, name, selected } }: Props) => {
	const updateDeckMutation = useUpdateDeck();

	return (
		<div className={`flex mt-2`} key={id}>
			<Link
				key={id}
				href={`/decks/${id}`}
				className="flex-1 item rounded-r-none border-r-0"
			>
				<p className="flex items-center">{name}</p>
			</Link>
			{selected ? (
				<div
					className="btn rounded-l-none items-center flex"
					onClick={() => {
						updateDeckMutation.mutate({
							name,
							id,
							selected: false,
						});
					}}
				>
					<FaPause />
				</div>
			) : (
				<div
					className="btn rounded-l-none flex items-center"
					onClick={() => {
						updateDeckMutation.mutate({
							name,
							id,
							selected: true,
						});
					}}
				>
					<FaPlay />
				</div>
			)}
		</div>
	);
};

const DeckList = ({ decks, token }: { decks: Deck[]; token: string }) => {
	const { data } = useQuery({
		queryKey: ["decks"],
		queryFn: () => getDecks(token),
		placeholderData: decks,
	});

	return (
		<>
			{data && data.map((deck) => <DeckItem key={deck.id} deck={deck} />)}
		</>
	);
};

export default DeckList;
