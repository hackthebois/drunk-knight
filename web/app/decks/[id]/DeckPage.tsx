"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import CardItem from "../../../components/CardItem";
import {
	CreateCard,
	CreateCardSchema,
	UpdateCard,
	UpdateCardSchema,
	useCreateCard,
	useDeleteCard,
	useUpdateCard,
} from "../../../hooks/card";
import { useDeck, useDeleteDeck } from "../../../hooks/deck";
import { Card, cardTypes } from "../../../types/Card";

const CardEditor = ({
	card,
	deckId,
	cancel,
}: {
	card: Card;
	deckId: string;
	cancel: () => void;
}) => {
	const updateCardMutation = useUpdateCard();
	const deleteCardMutation = useDeleteCard();
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
		updateCardMutation.mutate(data, { onSuccess: () => cancel() });
	};

	return (
		<>
			<div className="background w-full">
				<h2 className="text-2xl mb-8">Card Editor</h2>
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
					<button className="btn bg-border" onClick={cancel}>
						Cancel
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
			<button
				className="ebtn mt-8 w-full"
				onClick={() =>
					deleteCardMutation.mutate(
						{ id: card.id, deckId },
						{
							onSuccess: () => {
								console.log("success");
								cancel();
							},
						},
					)
				}
			>
				Delete Card
			</button>
		</>
	);
};

const CardAdd = ({
	deckId,
	cancel,
}: {
	deckId: string;
	cancel: () => void;
}) => {
	const createCardMutation = useCreateCard();
	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		watch,
	} = useForm<CreateCard>({
		defaultValues: {
			name: "Name here",
			description: "Description here",
			cardType: "CATEGORIES",
			deckId,
		},
		resolver: zodResolver(CreateCardSchema),
	});

	const cardState = watch();

	const onCreateCard = (data: CreateCard) => {
		createCardMutation.mutate(data, {
			onSuccess: () => cancel(),
		});
	};

	return (
		<div className="background w-full">
			<h2 className="text-2xl mb-8">Card Creator</h2>
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
				<button className="btn bg-border" onClick={cancel}>
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
	);
};

const DeckPage = ({ id: deckId }: { id: string }) => {
	const [editCard, setEditCard] = useState<Card | undefined>();
	const [addCard, setAddCard] = useState(false);

	const { data: deck } = useDeck(deckId);
	const deleteDeckMutation = useDeleteDeck();

	return (
		<main className="flex flex-col justify-between">
			{editCard ? (
				<CardEditor
					card={editCard}
					deckId={deckId}
					cancel={() => setEditCard(undefined)}
				/>
			) : addCard ? (
				<CardAdd deckId={deckId} cancel={() => setAddCard(false)} />
			) : (
				<>
					<div className="background flex flex-col flex-1 overflow-auto w-full">
						{deck && (
							<div className="flex justify-between items-center mb-8">
								<h2 className="text-2xl">{deck.name}</h2>
								<FaPlus
									onClick={() => setAddCard(true)}
									size={34}
									className="p-2 cursor-pointer"
								/>
							</div>
						)}
						<div className="flex-1 overflow-auto -mr-2 pr-2">
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
					</div>
					<button
						className="ebtn mt-8 w-full"
						onClick={() => deleteDeckMutation.mutate(deckId)}
					>
						Delete Deck
					</button>
				</>
			)}
		</main>
	);
};

export default DeckPage;
