"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
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
					<main className="flex flex-col justify-between">
						<div className="background flex flex-col flex-1 w-full h-full">
							{deck && (
								<div className="flex justify-between items-center mb-8">
									<h2 className="text-2xl font-bold">
										{deck.name}
									</h2>
									<FaPlus
										onClick={() => setAddCard(true)}
										size={34}
										className="p-2 cursor-pointer"
									/>
								</div>
							)}
							<div className="flex-1 overflow-auto max-h-full -mr-2 pr-2">
								{deck &&
									deck.cards &&
									deck.cards.map((card, index) => (
										<div
											key={card.id}
											className={`item flex flex-row justify-between align-center ${
												index !== 0 && "mt-4"
											}`}
											onClick={() => setEditCard(card)}
										>
											<div>
												<p className="flex items-center text-lg mb-2">
													{card.name}
												</p>
												<p className="flex items-center opacity-70">
													{card.description}
												</p>
											</div>
											<div className="flex justify-center items-center">
												<p>{card.cardType}</p>
											</div>
										</div>
									))}
							</div>
							<button
								className="ebtn mt-8 w-full"
								onClick={() =>
									deleteDeckMutation.mutate(deck.id)
								}
							>
								Delete Deck
							</button>
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
