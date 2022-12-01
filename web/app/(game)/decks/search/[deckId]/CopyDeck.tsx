"use client";

import { useAtom } from "jotai";
import { FaCopy } from "react-icons/fa";
import { env } from "../../../../../env/client.mjs";
import { tokenAtom } from "../../../../ClientWrapper";

type Props = {
	deckId: string;
};

const copyDeck = async ({
	token,
	deckId,
}: {
	token: string;
	deckId: string;
}) => {
	await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/search/deck/${deckId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
};

const CopyDeck = ({ deckId }: Props) => {
	const [token] = useAtom(tokenAtom);

	return (
		<button className="btn" onClick={() => copyDeck({ token, deckId })}>
			<FaCopy />
		</button>
	);
};

export default CopyDeck;
