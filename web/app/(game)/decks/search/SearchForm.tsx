"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaAngleLeft, FaPlus } from "react-icons/fa";
import { z } from "zod";

export const SearchSchema = z.object({
	id: z.string().cuid().min(1, "Id cannot be empty."),
});
export type Search = z.input<typeof SearchSchema>;

const SearchForm = () => {
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
		<div className="background flex flex-col w-full">
			<h2 className="text-2xl font-bold mb-4">Search Deck ID</h2>
			{errors.id && <p className="emsg mb-4">{errors.id.message}</p>}
			<form
				className="form sm:flex-row w-full"
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
					className={`btn sm:mr-2 mb-2 sm:mb-0 ${
						isDirty && isValid
							? ""
							: "opacity-50 cursor-not-allowed !important hover:opacity-50 !important"
					}`}
					type="submit"
					value="Search"
				/>
			</form>
		</div>
	);
};

export default SearchForm;
