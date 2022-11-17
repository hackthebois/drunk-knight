"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CardItem from "../../../components/CardItem";
import { env } from "../../../env/client.mjs";
import { Card, CardSchema, cardTypes } from "../../../types/Card";
import { Deck, DeckSchema } from "../../../types/Deck";

export const DeleteCardSchema = z.object({
	id: CardSchema.shape.id,
	deckId: DeckSchema.shape.id,
});
export type DeleteCard = z.infer<typeof DeleteCardSchema>;
const deleteCard = async ({
	deleteCard: { id, deckId },
	token,
}: {
	deleteCard: DeleteCard;
	token: string;
}) => {
	const res = await fetch(
		`${env.NEXT_PUBLIC_SERVER_URL}/deck/${deckId}/card/${id}`,
		{
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	);
	const data: unknown = await res.json();
	return CardSchema.parse(data);
};

export const UpdateCardSchema = z.object({
	id: CardSchema.shape.id,
	name: CardSchema.shape.name,
	description: CardSchema.shape.description,
	cardType: CardSchema.shape.cardType,
	deckId: DeckSchema.shape.id,
});
export type UpdateCard = z.infer<typeof UpdateCardSchema>;
export const updateCard = async ({
	newCard: { id, name, description, cardType, deckId },
	token,
}: {
	newCard: UpdateCard;
	token: string;
}) => {
	const res = await fetch(
		`${env.NEXT_PUBLIC_SERVER_URL}/deck/${deckId}/card/${id}`,
		{
			method: "PUT",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ name, description, cardType }),
		},
	);
	const data: unknown = await res.json();
	return CardSchema.parse(data);
};

const CardEditor = ({
	card,
	deckId,
	token,
	cancel,
}: {
	card: Card;
	deckId: string;
	token: string;
	cancel: () => void;
}) => {
	const queryClient = useQueryClient();
	const router = useRouter();

	const deleteCardMutation = useMutation(deleteCard, {
		onMutate: async ({ deleteCard: { id, deckId } }) => {
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
			cancel();
			return { previousDeck };
		},
		onError: (err, { deleteCard: { deckId } }, context) => {
			queryClient.setQueryData(["deck", deckId], context?.previousDeck);
		},
		onSettled: () => {
			router.refresh();
		},
	});

	const updateCardMutation = useMutation(updateCard, {
		onMutate: async ({
			newCard: { id, name, deckId, description, cardType },
		}) => {
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
			cancel();
			return { previousDeck };
		},
		onError: (err, { newCard: { deckId } }, context) => {
			queryClient.setQueryData(["deck", deckId], context?.previousDeck);
		},
		onSettled: () => {
			router.refresh();
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		watch,
	} = useForm<UpdateCard>({
		defaultValues: { ...card, deckId },
		resolver: zodResolver(UpdateCardSchema),
	});

	const cardState = watch();

	const onUpdateCard = (data: UpdateCard) => {
		updateCardMutation.mutate({ newCard: data, token });
	};

	return (
		<main className="flex flex-col justify-between">
			<div className="background flex flex-col flex-1 w-full overflow-auto">
				<h2 className="text-2xl mb-8 font-bold">Card Editor</h2>
				{errors.name ? (
					<p className="emsg mb-4">{errors.name.message}</p>
				) : errors.description ? (
					<p className="emsg mb-4">{errors.description.message}</p>
				) : (
					errors.cardType && (
						<p className="emsg mb-4">{errors.cardType.message}</p>
					)
				)}
				<form className="form" onSubmit={handleSubmit(onUpdateCard)}>
					<div className="flex flex-col md:flex-row">
						<input
							type="text"
							placeholder="Card Name"
							className="flex-1 mb-2 md:mr-2 md:mb-0"
							{...register("name")}
						/>
						<input
							type="text"
							placeholder="Card Description"
							className="flex-1 mb-2 md:mr-2 md:mb-0"
							{...register("description")}
						/>
						<select
							className="lg:mr-2 lg:mb-0"
							{...register("cardType")}
						>
							{cardTypes.map((cardType) => (
								<option value={cardType} key={cardType}>
									{cardType}
								</option>
							))}
						</select>
					</div>
				</form>
				<div className="w-full sm:w-[600px] h-[300px] sm:h-[450px] max-w-full bg-transparent m-auto my-10">
					<CardItem card={cardState} />
				</div>
				<div className="mt-4 flex flex-row justify-between">
					<button className="gbtn" onClick={() => cancel()}>
						Cancel
					</button>
					<button
						className="ebtn"
						onClick={() => {
							deleteCardMutation.mutate({
								deleteCard: { id: card.id, deckId },
								token,
							});
						}}
					>
						Delete Card
					</button>
					<button
						className={`btn ${
							isDirty
								? ""
								: "opacity-50 cursor-not-allowed !important hover:opacity-50 !important"
						}`}
						onClick={() => handleSubmit(onUpdateCard)()}
					>
						Save
					</button>
				</div>
			</div>
		</main>
	);
};

export default CardEditor;
