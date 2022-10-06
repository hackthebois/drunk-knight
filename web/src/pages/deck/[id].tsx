import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CardItem from '../../components/CardItem';
import Loader from '../../components/Loader';
import {
	CreateCard,
	CreateCardSchema,
	UpdateCard,
	UpdateCardSchema,
	useCreateCard,
	useUpdateCard,
} from '../../hooks/card';
import { useDeck, useDeleteDeck } from '../../hooks/deck';
import { Card } from '../../types/Card';

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
		<div className="background">
			<h2 className="text-2xl mb-8">Card Editor</h2>
			<form className="form" onSubmit={handleSubmit(onUpdateCard)}>
				{errors.name && <p className="ebtn">{errors.name.message}</p>}
				<div className="flex flex-col md:flex-row">
					<input
						type="text"
						placeholder="Card Name"
						className="flex-1 mb-2 md:mr-2 md:mb-0"
						{...register('name')}
					/>
					<input
						type="text"
						placeholder="Card Description"
						className="flex-1"
						{...register('description')}
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
							? ''
							: 'opacity-50 cursor-not-allowed !important hover:opacity-50 !important'
					}`}
					onClick={() => handleSubmit(onUpdateCard)()}
				>
					Save
				</button>
			</div>
		</div>
	);
};

const DeckPage = () => {
	const router = useRouter();
	const [editCard, setEditCard] = useState<Card | undefined>();

	const deckId = typeof router.query.id === 'string' ? router.query.id : '';
	const { data: deck } = useDeck(deckId);
	const createCardMutation = useCreateCard();
	const deleteDeckMutation = useDeleteDeck();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<CreateCard>({
		defaultValues: {
			name: '',
			description: '',
			cardType: 'ACTION',
			deckId,
		},
		resolver: zodResolver(CreateCardSchema),
	});

	useEffect(() => {
		setValue('deckId', deckId);
	}, [deckId]);

	const onCreateCard = (data: CreateCard) => {
		createCardMutation.mutate(data);
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
					<div className="background">
						{errors.cardType && (
							<div>{errors.cardType.message}</div>
						)}
						{errors.name && <div>{errors.name.message}</div>}
						{errors.description && (
							<div>{errors.description.message}</div>
						)}
						{deck && <h2 className="text-2xl mb-8">{deck.name}</h2>}
						<form
							className="form flex flex-col md:flex-row mb-6"
							onSubmit={handleSubmit(onCreateCard)}
						>
							{errors.name && (
								<p className="ebtn">{errors.name.message}</p>
							)}
							<input
								type="text"
								placeholder="Card Name"
								className="flex-1 mb-2 md:mr-2 md:mb-0"
								{...register('name')}
							/>
							<input
								type="text"
								placeholder="Card Description"
								className="flex-1 md:mr-2 mb-2 md:mb-0"
								{...register('description')}
							/>
							<input type="submit" value="Add New" />
						</form>
						{deck &&
							deck.cards &&
							deck.cards.map((card) => (
								<div
									key={card.id}
									className="item mt-4 flex flex-col justify-between align-center"
									onClick={() => setEditCard(card)}
								>
									<p className="flex items-center text-lg mb-2">
										{card.name}
									</p>
									<p className="flex items-center opacity-70">
										{card.description}
									</p>
								</div>
							))}
						<Loader visible={createCardMutation.isLoading} />
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
