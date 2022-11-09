"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPause, FaPlay, FaPlus, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import { CreateDeck, CreateDeckSchema, useCreateDeck } from "../../hooks/deck";
import { Deck } from "../../types/Deck";
import DeckItem from "./DeckItem";

const DecksPage = ({ decks }: { decks: Deck[] }) => {
	const router = useRouter();
	const createDeckMutation = useCreateDeck();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateDeck>({
		resolver: zodResolver(CreateDeckSchema),
	});
	const [addDeck, setAddDeck] = useState(false);

	const onCreateDeck = ({ name }: CreateDeck) => {
		createDeckMutation.mutate(
			{ name },
			{
				onSuccess: () => {
					router.refresh();
					reset();
				},
			},
		);
	};
	return (
		<main>
			<div className="background flex-1 flex flex-col overflow-auto w-full">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-bold">Decks</h2>
					{addDeck ? (
						<FaTimes
							onClick={() => setAddDeck(false)}
							size={34}
							className="p-2 cursor-pointer"
						/>
					) : (
						<FaPlus
							onClick={() => setAddDeck(true)}
							size={34}
							className="p-2 cursor-pointer"
						/>
					)}
				</div>
				{addDeck && (
					<>
						{errors.name && (
							<p className="emsg mb-4">{errors.name.message}</p>
						)}
						<form
							className="form sm:flex-row w-full mb-6"
							onSubmit={handleSubmit(onCreateDeck)}
						>
							<input
								type="text"
								placeholder="Deck Name"
								className="sm:mr-2 mb-2 sm:mb-0 flex-1"
								{...register("name")}
								autoComplete="off"
							/>
							<input type="submit" value="Add New" />
						</form>
					</>
				)}
				<div className="flex-1 overflow-y-scroll -mr-2 pr-2">
					{decks?.map((deck) => (
						<DeckItem deck={deck} />
					))}
					<Loader visible={createDeckMutation.isLoading} />
				</div>
			</div>
		</main>
	);
};

export default DecksPage;
