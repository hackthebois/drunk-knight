"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaPause, FaPlay } from "react-icons/fa";
import Loader from "../../components/Loader";
import { useUpdateDeck } from "../../hooks/deck";
import { Deck } from "../../types/Deck";

type Props = {
	deck: Deck;
};

const DeckItem = ({ deck: { id, name, selected } }: Props) => {
	const updateDeckMutation = useUpdateDeck();

	return (
		<div className={`flex mt-2`} key={id}>
			<Link
				key={id}
				href={`/decks/${id}`}
				className="flex-1 item rounded-r-none border-r-0"
			>
				<p className="flex items-center">{name}</p>
			</Link>
			{selected ? (
				<div
					className="btn rounded-l-none items-center flex"
					onClick={() =>
						updateDeckMutation.mutate({
							name,
							id,
							selected: false,
						})
					}
				>
					<FaPause />
				</div>
			) : (
				<div
					className="btn rounded-l-none flex items-center"
					onClick={() =>
						updateDeckMutation.mutate({
							name,
							id,
							selected: true,
						})
					}
				>
					<FaPlay />
				</div>
			)}
		</div>
	);
};

export default DeckItem;
