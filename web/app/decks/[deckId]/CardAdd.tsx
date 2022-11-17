"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CardItem from "../../../components/CardItem";
import { env } from "../../../env/client.mjs";
import { CardSchema, cardTypes } from "../../../types/Card";
import { Deck, DeckSchema } from "../../../types/Deck";

// CREATE CARD (POST /deck/:deckId/card/create)
export const CreateCardSchema = z.object({
	name: CardSchema.shape.name,
	description: CardSchema.shape.description,
	cardType: CardSchema.shape.cardType,
	deckId: DeckSchema.shape.id,
});
export type CreateCard = z.infer<typeof CreateCardSchema>;
const createCard = async ({
	newCard: { name, description, cardType, deckId },
	token,
}: {
	newCard: CreateCard;
	token: string;
}) => {
	const res = await fetch(
		`${env.NEXT_PUBLIC_SERVER_URL}/deck/${deckId}/card/create`,
		{
			method: "POST",
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

const CardAdd = ({
	deckId,
	token,
	cancel,
}: {
	deckId: string;
	token: string;
	cancel: () => void;
}) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const createCardMutation = useMutation(createCard, {
		onMutate: async ({
			newCard: { name, deckId, description, cardType },
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
								cards: [
									...old.cards,
									{ name, description, cardType, id: "555" },
								],
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
	} = useForm<CreateCard>({
		defaultValues: {
			name: "",
			description: "",
			cardType: "CATEGORIES",
			deckId,
		},
		resolver: zodResolver(CreateCardSchema),
	});

	const cardState = watch();

	const onCreateCard = (data: CreateCard) => {
		createCardMutation.mutate({ newCard: data, token });
	};

	return (
		<main className="flex flex-col justify-between">
			<div className="background flex flex-col flex-1 w-full">
				<h2 className="text-2xl mb-8 font-bold">Card Creator</h2>
				{errors.name ? (
					<p className="emsg mb-4">{errors.name.message}</p>
				) : errors.description ? (
					<p className="emsg mb-4">{errors.description.message}</p>
				) : (
					errors.cardType && (
						<p className="emsg mb-4">{errors.cardType.message}</p>
					)
				)}
				<form className="form" onSubmit={handleSubmit(onCreateCard)}>
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
					<CardItem card={{ id: "123", ...cardState }} />
				</div>
				<div className="mt-4 flex flex-row justify-between">
					<button className="gbtn" onClick={() => cancel()}>
						Cancel
					</button>
					<button
						className={`btn ${
							isDirty
								? ""
								: "opacity-50 cursor-not-allowed !important hover:opacity-50 !important"
						}`}
						onClick={() => handleSubmit(onCreateCard)()}
					>
						Create
					</button>
				</div>
			</div>
		</main>
	);
};

export default CardAdd;
