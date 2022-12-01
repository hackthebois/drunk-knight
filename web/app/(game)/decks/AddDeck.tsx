"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import {
	CreateDeck,
	CreateDeckSchema,
	useCreateDeck,
} from "../../../hooks/deck";
import { tokenAtom } from "../../ClientWrapper";

const AddDeck = () => {
	const createDeckMutation = useCreateDeck();
	const [token] = useAtom(tokenAtom);

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		setValue,
		reset,
	} = useForm<CreateDeck>({
		resolver: zodResolver(CreateDeckSchema),
		defaultValues: { name: "" },
	});
	const [addDeck, setAddDeck] = useState(false);

	const onCreateDeck = ({ name }: CreateDeck) => {
		reset();
		createDeckMutation.mutate(
			{ deck: { name }, token },
			{
				onError: () => {
					setValue("name", name, { shouldDirty: true });
				},
			},
		);
	};
	return (
		<>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold">Decks</h2>
				{addDeck ? (
					<button className="gbtn" onClick={() => setAddDeck(false)}>
						<FaTimes />
					</button>
				) : (
					<button className="btn" onClick={() => setAddDeck(true)}>
						<FaPlus />
					</button>
				)}
			</div>
			{addDeck ? (
				<>
					{errors.name && (
						<p className="emsg mb-4">{errors.name.message}</p>
					)}
					<form
						className="form sm:flex-row w-full mb-3"
						onSubmit={handleSubmit(onCreateDeck)}
					>
						<input
							type="text"
							placeholder="Deck Name"
							className="sm:mr-2 mb-2 sm:mb-0 flex-1 ml-[1px]"
							{...register("name")}
							autoComplete="off"
						/>
						<input
							className={`btn mb-2 sm:mb-0 ${
								isDirty
									? ""
									: "opacity-50 cursor-not-allowed !important hover:opacity-50 !important"
							}`}
							type="submit"
							value="Create"
						/>
					</form>
				</>
			) : null}
		</>
	);
};

export default AddDeck;
