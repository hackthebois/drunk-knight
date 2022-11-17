"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import CardItem from "../../../components/CardItem";
import {
	CreateCard,
	CreateCardSchema,
	useCreateCard,
} from "../../../hooks/card";
import { cardTypes } from "../../../types/Card";

const CardAdd = ({
	deckId,
	token,
	cancel,
}: {
	deckId: string;
	token: string;
	cancel: () => void;
}) => {
	const createCardMutation = useCreateCard();
	const router = useRouter();
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
		cancel();
		createCardMutation.mutate(data);
	};

	return (
		<main className="flex flex-col justify-between">
			<div className="background flex flex-col flex-1 overflow-auto w-full">
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
