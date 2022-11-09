import { cookies } from "next/headers.js";
import { env } from "../../env/client.mjs";
import { Deck, DeckSchema } from "../../types/Deck";
import DecksPage from "./DecksPage";

const getDecks = async ({ token }: { token: string }) => {
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

const Page = async () => {
	const nextCookies = cookies();
	const token = nextCookies.get("accessToken")?.value;

	if (token) {
		const decks = await getDecks({ token });

		return <DecksPage decks={decks} />;
	} else {
		return <DecksPage decks={[]} />;
	}
};

export default Page;
