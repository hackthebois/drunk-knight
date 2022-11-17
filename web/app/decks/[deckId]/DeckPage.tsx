"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import CardItem from "../../../components/CardItem";
import { env } from "../../../env/client.mjs";

import { useDeleteDeck } from "../../../hooks/deck";
import { Card } from "../../../types/Card";
import { Deck, DeckSchema } from "../../../types/Deck";
import CardAdd from "./CardAdd";
import CardEditor from "./CardEditor";

const getDeck = async ({
	deckId,
	token,
}: {
	deckId: string;
	token: string;
}) => {
	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck/${deckId}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const data: unknown = await res.json();
	return DeckSchema.parse(data);
};

const DeckPage = ({
	token,
	deckId,
	placeholderDeck,
}: {
	token: string;
	deckId: string;
	placeholderDeck: Deck;
}) => {
	const [editCard, setEditCard] = useState<Card | undefined>();
	const [addCard, setAddCard] = useState(false);
	const { data: deck } = useQuery({
		queryKey: ["deck", deckId],
		queryFn: () => getDeck({ token, deckId }),
		placeholderData: placeholderDeck,
		refetchOnMount: false,
	});

	const deleteDeckMutation = useDeleteDeck();

	if (deck) {
		return (
			<>
				{editCard ? (
					<CardEditor
						card={editCard}
						deckId={deck.id}
						token={token}
						cancel={() => setEditCard(undefined)}
					/>
				) : addCard ? (
					<CardAdd
						token={token}
						deckId={deck.id}
						cancel={() => setAddCard(false)}
					/>
				) : (
					<main className="flex flex-col justify-start">
						<div className="background flex flex-col w-full">
							{deck && (
								<>
									<div className="flex justify-between items-center mb-8">
										<h2 className="text-2xl font-bold">
											{deck.name}
										</h2>
										<div className="flex flex-row">
											<FaPlus
												onClick={() => setAddCard(true)}
												size={37}
												className="p-2 cursor-pointer mr-2"
											/>
											<FaTrash
												className="p-2 cursor-pointer"
												size={35}
												onClick={() =>
													deleteDeckMutation.mutate(
														deck.id,
													)
												}
											/>
										</div>
									</div>
									<div className="flex-1">
										{deck.cards &&
											deck.cards.map((card, index) => (
												<div
													key={card.id}
													className={`${
														index !== 0 && "mt-4"
													}`}
													onClick={() =>
														setEditCard(card)
													}
												>
													<CardItem card={card} />
												</div>
											))}
									</div>
								</>
							)}
						</div>
					</main>
				)}
			</>
		);
	} else {
		return <h2>Deck not found</h2>;
	}
};

export default DeckPage;
