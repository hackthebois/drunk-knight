"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
	FaAngleLeft,
	FaCopy,
	FaEdit,
	FaEye,
	FaEyeSlash,
	FaPlus,
	FaTrash,
} from "react-icons/fa";
import CardItem from "../../../../components/CardItem";
import ConfirmDelete from "../../../../components/ConfirmDelete";
import { env } from "../../../../env/client.mjs";

import type { UpdateDeck } from "../../../../hooks/deck";
import {
	UpdateDeckSchema,
	useDeleteDeck,
	useUpdateDeck,
} from "../../../../hooks/deck";
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

const DeckName = ({ deck }: { deck: Deck }) => {
	const [token] = useAtom(tokenAtom);
	const [editMode, setEditMode] = useState(false);
	const updateDeckMutation = useUpdateDeck(() => setEditMode(false));

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		reset,
	} = useForm<UpdateDeck>({
		resolver: zodResolver(UpdateDeckSchema),
		defaultValues: {
			name: deck.name,
			id: deck.id,
			selected: deck.selected,
		},
	});

	const onUpdateDeck = ({
		name,
		id,
		selected,
		private: isPrivate,
	}: UpdateDeck) => {
		updateDeckMutation.mutate(
			{
				updateDeck: { name, id, selected, private: isPrivate },
				token,
			},
			{
				onSuccess: () => {
					toast.success(`Updated deck "${deck.name}"`);
				},
				onError: () => {
					reset();
					toast.error(`Error updating deck "${deck.name}"`);
				},
			},
		);
	};

	return (
		<>
			{editMode ? (
				<>
					{errors.name && (
						<p className="emsg mb-4">{errors.name.message}</p>
					)}
					<form
						className="form sm:flex-row w-full mb-2"
						onSubmit={handleSubmit(onUpdateDeck)}
					>
						<input
							type="text"
							placeholder="Deck Name"
							className="sm:mr-2 mb-2 sm:mb-0 flex-1 ml-[1px]"
							{...register("name")}
							autoComplete="off"
						/>
						<div className="flex">
							<input
								className={`btn flex-1 ${
									isDirty
										? ""
										: "opacity-50 cursor-not-allowed !important hover:opacity-50 !important"
								}`}
								type="submit"
								value="Update"
							/>
							<div
								className="ml-2 gbtn flex-1"
								onClick={() => setEditMode(false)}
							>
								Cancel
							</div>
						</div>
					</form>
				</>
			) : (
				<div className="flex items-center justify-left mb-4">
					<h2 className="text-2xl font-bold">{deck.name}</h2>
					<FaEdit
						size={20}
						className="ml-4 cursor-pointer"
						onClick={() => setEditMode(true)}
					/>
				</div>
			)}
		</>
	);
};

const PrivateButton = ({ deck }: { deck: Deck }) => {
	const updateDeckMutation = useUpdateDeck();
	const [token] = useAtom(tokenAtom);
	const router = useRouter();
	return (
		<>
			{deck.private ? (
				<button
					className="gbtn mr-3"
					onClick={() =>
						updateDeckMutation.mutate(
							{
								updateDeck: { ...deck, private: false },
								token,
							},
							{
								onSuccess: () => {
									router.refresh();
									toast.success(
										`Deck "${deck.name}" is now public`,
									);
								},
							},
						)
					}
				>
					<FaEyeSlash />
				</button>
			) : (
				<button
					className="gbtn mr-3"
					onClick={() =>
						updateDeckMutation.mutate(
							{
								updateDeck: { ...deck, private: true },
								token,
							},
							{
								onSuccess: () => {
									router.refresh();
									toast.success(
										`Deck "${deck.name}" is now private`,
									);
								},
							},
						)
					}
				>
					<FaEye />
				</button>
			)}
		</>
	);
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
											<PrivateButton deck={deck} />
											<button
												className="item mr-3"
												onClick={() => {
													navigator.clipboard
														.writeText(deckId)
														.then(() => {
															toast.success(
																"Copied deck id",
															);
														});
												}}
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
									<DeckName deck={deck} />
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
