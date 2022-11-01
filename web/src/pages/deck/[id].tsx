import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CardItem from "../../components/CardItem";
import Loader from "../../components/Loader";
import {
	CreateCard,
	CreateCardSchema,
	UpdateCard,
	UpdateCardSchema,
	useCreateCard,
	useDeleteCard,
	useUpdateCard,
} from "../../hooks/card";
import { useDeck, useDeleteDeck } from "../../hooks/deck";
import { Card, cardTypes } from "../../types/Card";

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
			<div className="background">
				<h2 className="text-2xl mb-8">Card Editor</h2>
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
							className="flex-1"
							{...register("description")}
						/>
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
				className="ebtn mt-8"
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

const DeckPage = () => {
	const router = useRouter();
	const [editCard, setEditCard] = useState<Card | undefined>();

	const deckId = typeof router.query.id === "string" ? router.query.id : "";
	const { data: deck } = useDeck(deckId);
	const createCardMutation = useCreateCard();
	const deleteDeckMutation = useDeleteDeck();

	const {
		register,
		handleSubmit,
		formState: { errors },
		resetField,
		setValue,
	} = useForm<CreateCard>({
		defaultValues: {
			name: "",
			description: "",
			cardType: "CATEGORIES",
			deckId,
		},
		resolver: zodResolver(CreateCardSchema),
	});

	useEffect(() => {
		setValue("deckId", deckId);
	}, [deckId]);

	const onCreateCard = (data: CreateCard) => {
		createCardMutation.mutate(data, {
			onSuccess: () => {
				resetField("name");
				resetField("description");
			},
		});
	};

	return (
		<main className="flex flex-col justify-between">
			{editCard ? (
				<CardEditor
					card={editCard}
					deckId={deckId}
					cancel={() => setEditCard(undefined)}
				/>
			) : (
				<>
					<div className="background flex flex-col flex-1 overflow-auto">
						{deck && <h2 className="text-2xl mb-8">{deck.name}</h2>}
						{errors.name ? (
							<p className="emsg mb-4">{errors.name.message}</p>
						) : errors.description ? (
							<p className="emsg mb-4">
								{errors.description.message}
							</p>
						) : (
							errors.cardType && (
								<p className="emsg mb-4">
									{errors.cardType.message}
								</p>
							)
						)}
						<form
							className="form flex flex-col lg:flex-row mb-6"
							onSubmit={handleSubmit(onCreateCard)}
						>
							<input
								type="text"
								placeholder="Card Name"
								className="flex-1 mb-2 lg:mr-2 lg:mb-0"
								{...register("name", { required: true })}
								autoComplete="off"
							/>
							<input
								type="text"
								placeholder="Card Description"
								className="flex-1 lg:mr-2 mb-2 lg:mb-0"
								{...register("description", { required: true })}
								autoComplete="off"
							/>
							<select
								className="lg:mr-2 mb-2 lg:mb-0"
								{...register("cardType")}
							>
								{cardTypes.map((cardType) => (
									<option value={cardType} key={cardType}>
										{cardType}
									</option>
								))}
							</select>
							<input type="submit" value="Add New" />
						</form>
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
							<div className="mt-4">
								<Loader
									visible={createCardMutation.isLoading}
								/>
							</div>
						</div>
					</div>
					<button
						className="ebtn mt-8"
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
