import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import DeckPage from "./DeckPage";
import { env } from "../../../env/client.mjs";
import { DeckSchema } from "../../../types/Deck";

type Props = {
	params: {
		deckId: string;
		page: string;
	};
};

const getDeck = async ({
	deckId,
	token,
}: {
	deckId: string;
	token: string;
}) => {
	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck/${deckId}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const data: unknown = await res.json();
	if (res.status === 404) {
		return undefined;
	} else {
		return DeckSchema.parse(data);
	}
};

const Page = async ({ params: { deckId } }: Props) => {
	const nextCookies = cookies();
	const token = nextCookies.get("accessToken")?.value;

	if (token) {
		const deck = await getDeck({ deckId, token });

		if (!deck) {
			notFound();
		}

		return <DeckPage placeholderDeck={deck} deckId={deckId} />;
	} else {
		redirect("/auth/signin");
	}
};

export default Page;
