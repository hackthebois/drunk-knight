"use client";

import { useAtom } from "jotai";
import { FaCopy } from "react-icons/fa";
import { useCopyDeck } from "../../../../../hooks/deck";
import { tokenAtom } from "../../../../ClientWrapper";
import { SearchDeck } from "./page";

type Props = {
	searchDeck: SearchDeck;
	deckId: string;
};

const CopyDeck = ({ searchDeck, deckId }: Props) => {
	const [token] = useAtom(tokenAtom);
	const copyDeck = useCopyDeck();

	return (
		<button
			className="btn"
			onClick={() => copyDeck.mutate({ token, deck: searchDeck, deckId })}
		>
			<FaCopy />
		</button>
	);
};

export default CopyDeck;
