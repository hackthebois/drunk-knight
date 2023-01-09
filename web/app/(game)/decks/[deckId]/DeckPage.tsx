"use client";

import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaAngleLeft, FaCopy, FaPlus, FaTrash } from "react-icons/fa";
import CardItem from "../../../../components/CardItem";
import ConfirmDelete from "../../../../components/ConfirmDelete";
import { env } from "../../../../env/client.mjs";

import { useDeleteDeck } from "../../../../hooks/deck";
import type { Card } from "../../../../types/Card";
import type { Deck } from "../../../../types/Deck";
import { DeckSchema } from "../../../../types/Deck";
import { tokenAtom } from "../../../ClientWrapper";
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
	deckId,
	placeholderDeck,
}: {
	deckId: string;
	placeholderDeck: Deck;
}) => {
	const router = useRouter();
	const [token] = useAtom(tokenAtom);
	const [editCard, setEditCard] = useState<Card | undefined>();
	const [addCard, setAddCard] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);
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
						cancel={() => setEditCard(undefined)}
					/>
				) : addCard ? (
					<CardAdd
						deckId={deck.id}
						cancel={() => setAddCard(false)}
					/>
				) : (
					<main className="flex justify-start items-center flex-col w-full">
						<div className="background flex flex-col w-full">
							{deck && (
								<>
									<div className="flex justify-between items-center mb-8">
										<button
											className="gbtn mr-3"
											onClick={() => router.back()}
										>
											<FaAngleLeft />
										</button>
										<div className="flex flex-row">
											<button
												className="item mr-3"
												onClick={() =>
													navigator.clipboard.writeText(
														deckId,
													)
												}
											>
												<FaCopy />
											</button>
											<button
												className="ebtn mr-3"
												onClick={() =>
													setConfirmDelete(true)
												}
											>
												<FaTrash />
											</button>
											{confirmDelete ? (
												<ConfirmDelete
													onDelete={() =>
														deleteDeckMutation.mutate(
															{
																id: deck.id,
																token,
															},
														)
													}
													onCancel={() =>
														setConfirmDelete(false)
													}
													deletedItem={`deck "${deck.name}"`}
												/>
											) : null}
											<button
												className="btn"
												onClick={() => setAddCard(true)}
											>
												<FaPlus />
											</button>
										</div>
									</div>
									<h2 className="text-2xl font-bold mb-4">
										{deck.name}
									</h2>
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
