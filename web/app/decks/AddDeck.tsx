"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { CreateDeck, CreateDeckSchema, useCreateDeck } from "../../hooks/deck";

const AddDeck = ({ token }: { token: string }) => {
	const createDeckMutation = useCreateDeck();

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
		<div className="mt-4">
			{addDeck ? (
				<>
					{errors.name && (
						<p className="emsg mb-4">{errors.name.message}</p>
					)}
					<form
						className="form sm:flex-row w-full"
						onSubmit={handleSubmit(onCreateDeck)}
					>
						<input
							type="text"
							placeholder="Deck Name"
							className="sm:mr-2 mb-2 sm:mb-0 flex-1 ml-[1px]"
							{...register("name")}
							autoComplete="off"
						/>
						<button
							className="gbtn sm:mr-2 mb-2 sm:mb-0"
							onClick={() => setAddDeck(false)}
						>
							Cancel
						</button>
						<button
							className={`btn ${
								isDirty
									? ""
									: "opacity-50 cursor-not-allowed !important hover:opacity-50 !important"
							}`}
							type="submit"
						>
							Create
						</button>
					</form>
				</>
			) : (
				<div
					className="gbtn flex justify-center"
					onClick={() => setAddDeck(true)}
				>
					<FaPlus />
				</div>
			)}
		</div>
	);
};

export default AddDeck;
