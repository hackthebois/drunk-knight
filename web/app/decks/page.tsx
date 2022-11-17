import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AddDeck from "./AddDeck";
import GuestDeck from "./GuestDeck";
import DeckList from "./DeckList";
import { env } from "../../env/client.mjs";
import { DeckSchema } from "../../types/Deck";

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

const Page = async () => {
	const nextCookies = cookies();
	const token = nextCookies.get("accessToken")?.value;
	const useStandard = nextCookies.get("useStandard")?.value;

	if (token) {
		const decks = await getDecks(token);
		return (
			<main className="flex justify-start items-center flex-col w-full">
				<div className="background flex flex-col w-full">
					<h2 className="text-2xl font-bold mb-4">Decks</h2>
					<GuestDeck
						useStandard={useStandard === "false" ? false : true}
					/>
					<DeckList token={token} decks={decks} />
					<AddDeck token={token} />
				</div>
			</main>
		);
	} else {
		redirect("/guest");
	}
};

export default Page;
