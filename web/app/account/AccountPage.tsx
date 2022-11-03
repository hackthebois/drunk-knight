"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation.js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import {
	CreateDeck,
	CreateDeckSchema,
	useCreateDeck,
	useDecks,
	useUpdateDeck,
} from "../../hooks/deck";
import { useSignOut, useUser } from "../../hooks/user";

const Account = () => {
	const router = useRouter();
	const signOut = useSignOut();

	const { data: user } = useUser();
	const { data: decks } = useDecks();
	const createDeckMutation = useCreateDeck();
	const updateDeckMutation = useUpdateDeck();

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
		createDeckMutation.mutate({ name }, { onSuccess: () => reset() });
	};

	return (
		<main className="flex flex-col justify-between max-h-[100vh]">
			<div className="background mb-8">
				<h2 className="text-2xl font-bold mb-4">Profile</h2>
				<p className="my-2">{user?.email}</p>
				<p className="my-2">{user?.username}</p>
				<p className="my-2">
					Email Confirmed:{" "}
					{user?.emailConfirmation ? "True" : "False"}
				</p>
				<button className="gbtn mt-3" onClick={() => signOut()}>
					Sign out
				</button>
			</div>
			<div className="background flex-1 flex flex-col overflow-auto">
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
					{decks?.map(({ name, id, selected }, index) => (
						<div
							className={`flex ${index !== 0 && "mt-2"}`}
							key={id}
						>
							<div
								key={id}
								onClick={() => router.push(`/deck/${id}`)}
								className="flex-1 item rounded-r-none border-r-0"
							>
								<p className="flex items-center">{name}</p>
							</div>
							{selected ? (
								<button
									className="btn rounded-l-none"
									onClick={() =>
										updateDeckMutation.mutate({
											name,
											id,
											selected: false,
										})
									}
								>
									Unselect
								</button>
							) : (
								<button
									className="btn rounded-l-none"
									onClick={() =>
										updateDeckMutation.mutate({
											name,
											id,
											selected: true,
										})
									}
								>
									Select
								</button>
							)}
						</div>
					))}
					<Loader visible={createDeckMutation.isLoading} />
				</div>
			</div>
		</main>
	);
};

export default Account;
