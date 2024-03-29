"use client";

import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
	FaCheck,
	FaEye,
	FaEyeSlash,
	FaPlus,
	FaToggleOff,
	FaToggleOn,
} from "react-icons/fa";
import { env } from "../../../env/client.mjs";
import { useUpdateDeck } from "../../../hooks/deck";
import type { Deck } from "../../../types/Deck";
import { DeckSchema } from "../../../types/Deck";
import { tokenAtom } from "../../ClientWrapper";

const getDecks = async (token: string) => {
	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const data: unknown = await res.json();
	return DeckSchema.array().parse(data);
};

const DeckItem = ({
	deck: { id, name, selected, private: isPrivate },
}: {
	deck: Deck;
}) => {
	const updateDeckMutation = useUpdateDeck();
	const [token] = useAtom(tokenAtom);

	const setDeckSelect = (select: boolean) => {
		updateDeckMutation.mutate(
			{
				updateDeck: {
					name,
					id,
					private: isPrivate,
					selected: select,
				},
				token,
			},
			{
				onError: () => {
					toast.error(`Error selecting deck "${name}"`);
				},
			},
		);
	};

	return (
		<div className={"flex mt-2"} key={id}>
			<Link
				key={id}
				href={`/decks/${id}`}
				className="flex-1  item rounded-r-none border-r-0 flex justify-between overflow-hidden pr-0 sm:pr-2"
			>
				<p className="break-all flex-1 pr-2">{name}</p>
				{isPrivate ? (
					<FaEyeSlash
						size={18}
						className="opacity-70 min-w-8 mr-3 sm:mr-4"
					/>
				) : (
					<FaEye
						size={18}
						className="opacity-70 min-w-8 mr-3 sm:mr-4"
					/>
				)}
				{selected ? (
					<p className="text-xs font-bold bg-green-400 w-8 text-center rounded py-[2px]">
						ON
					</p>
				) : (
					<p className="text-xs font-bold bg-red-400 w-8 text-center rounded py-[2px]">
						OFF
					</p>
				)}
			</Link>
			{selected ? (
				<div
					className="rounded-l-none items-center w-12 py-2 rounded shadow text-white border-[1px] border-[#ccc] cursor-pointer flex justify-center border-l-0"
					onClick={() => setDeckSelect(false)}
				>
					<FaToggleOn size={24} />
				</div>
			) : (
				<div
					className="rounded-l-none items-center w-12 py-2 rounded shadow text-white border-[1px] border-[#ccc] cursor-pointer flex justify-center border-l-0"
					onClick={() => setDeckSelect(true)}
				>
					<FaToggleOff size={24} />
				</div>
			)}
		</div>
	);
};

const DeckList = ({ decks }: { decks: Deck[] }) => {
	const [token] = useAtom(tokenAtom);
	const { data } = useQuery({
		queryKey: ["decks"],
		queryFn: () => getDecks(token),
		placeholderData: decks,
		refetchOnMount: false,
	});

	return (
		<>
			{data && data.map((deck) => <DeckItem key={deck.id} deck={deck} />)}
		</>
	);
};

export default DeckList;
