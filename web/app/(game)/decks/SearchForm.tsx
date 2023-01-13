"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaSearch, FaTimes } from "react-icons/fa";
import { z } from "zod";

export const SearchSchema = z.object({
	id: z.string().cuid().min(1, "Id cannot be empty."),
});
export type Search = z.input<typeof SearchSchema>;

const SearchForm = () => {
	const [searchOpen, setSearchOpen] = useState(false);
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isDirty, isValid },
	} = useForm<Search>({
		resolver: zodResolver(SearchSchema),
		defaultValues: { id: "" },
	});

	const onSearchDeck = ({ id }: Search) => {
		router.push(`/decks/search/${id}`);
	};
	return (
		<>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl sm:text-2xl font-bold">
					Community Decks
				</h2>
				{searchOpen ? (
					<button
						className="gbtn"
						onClick={() => setSearchOpen(false)}
					>
						<FaTimes />
					</button>
				) : (
					<button className="btn" onClick={() => setSearchOpen(true)}>
						<FaSearch />
					</button>
				)}
			</div>
			{searchOpen ? (
				<>
					{errors.id && (
						<p className="emsg mb-4">{errors.id.message}</p>
					)}
					<form
						className="form sm:flex-row w-full mb-2"
						onSubmit={handleSubmit(onSearchDeck)}
					>
						<input
							type="text"
							placeholder="Deck ID"
							className="sm:mr-2 mb-2 sm:mb-0 flex-1 ml-[1px]"
							{...register("id")}
							autoComplete="off"
						/>
						<input
							className={`btn ${
								isDirty && isValid
									? ""
									: "opacity-50 cursor-not-allowed !important hover:opacity-50 !important"
							}`}
							type="submit"
							value="Search"
						/>
					</form>
				</>
			) : null}
		</>
	);
};

export default SearchForm;
