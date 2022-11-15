"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { useUpdateDeck } from "../../hooks/deck";
import { Deck } from "../../types/Deck";

type Props = {
	deck: Deck;
};

const DeckItem = ({ deck: { id, name, selected } }: Props) => {
	const updateDeckMutation = useUpdateDeck();
	const [isSelected, setIsSelected] = useState(selected);
	const router = useRouter();

	return (
		<div className={`flex mt-2`} key={id}>
			<Link
				key={id}
				href={`/decks/${id}`}
				className="flex-1 item rounded-r-none border-r-0"
			>
				<p className="flex items-center">{name}</p>
			</Link>
			{isSelected ? (
				<div
					className="btn rounded-l-none items-center flex"
					onClick={() => {
						setIsSelected(false);
						updateDeckMutation.mutate(
							{
								name,
								id,
								selected: false,
							},
							{
								onSettled: () => {
									router.refresh();
								},
								onError: () => {
									setIsSelected(true);
								},
							},
						);
					}}
				>
					<FaPause />
				</div>
			) : (
				<div
					className="btn rounded-l-none flex items-center"
					onClick={() => {
						setIsSelected(true);
						updateDeckMutation.mutate(
							{
								name,
								id,
								selected: true,
							},
							{
								onSettled: () => {
									router.refresh();
								},
								onError: () => {
									setIsSelected(false);
								},
							},
						);
					}}
				>
					<FaPlay />
				</div>
			)}
		</div>
	);
};

export default DeckItem;
