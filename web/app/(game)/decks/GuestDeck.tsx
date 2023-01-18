"use client";

import { FaToggleOff, FaToggleOn } from "react-icons/fa";
import { useAtom } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import type { Deck } from "../../../types/Deck";
import { excludeDeckIdsAtom } from "../../ClientWrapper";

type Props = {
	deck: Deck;
};

const GuestDeck = ({ deck }: Props) => {
	const [excludeDeckIds, setExcludeDeckIds] = useAtom(excludeDeckIdsAtom);
	const queryClient = useQueryClient();

	return (
		<div className={`flex mt-2`}>
			<Link
				href={`/decks/standard/${deck.id}`}
				className="flex-1 item pr-0 sm:pr-2 flex justify-between items-center rounded-r-none border-r-0"
			>
				<p className="break-all">{deck.name}</p>
				{!excludeDeckIds.includes(deck.id) ? (
					<p className="text-xs font-bold bg-green-400 w-8 text-center rounded py-[2px]">
						ON
					</p>
				) : (
					<p className="text-xs font-bold bg-red-400 w-8 text-center rounded py-[2px]">
						OFF
					</p>
				)}
			</Link>
			{excludeDeckIds.includes(deck.id) ? (
				<div
					className="rounded-l-none items-center w-12 py-2 rounded shadow text-white border-[1px] border-[#ccc] cursor-pointer flex justify-center border-l-0"
					onClick={() => {
						setExcludeDeckIds(
							excludeDeckIds.filter((id) => deck.id !== id),
						);
						queryClient.refetchQueries(["play"]);
					}}
				>
					<FaToggleOff size={24} />
				</div>
			) : (
				<div
					className="rounded-l-none items-center w-12 py-2 rounded shadow text-white border-[1px] border-[#ccc] cursor-pointer flex justify-center border-l-0"
					onClick={() => {
						setExcludeDeckIds([...excludeDeckIds, deck.id]);
						queryClient.refetchQueries(["play"]);
					}}
				>
					<FaToggleOn size={24} />
				</div>
			)}
		</div>
	);
};

export default GuestDeck;
