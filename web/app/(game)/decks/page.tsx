import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AddDeck from "./AddDeck";
import GuestDeck from "./GuestDeck";
import DeckList from "./DeckList";
import { env } from "../../../env/client.mjs";
import { DeckSchema } from "../../../types/Deck";
import { FaDownload } from "react-icons/fa";
import Link from "next/link";
import { z } from "zod";
import SearchForm from "./SearchForm";

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

const UserDeckSchema = z.object({
	id: z.string().cuid(),
	name: z.string(),
	copiedNumber: z.number(),
});

const getCommunityDecks = async (token: string) => {
	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/search`, {
		method: "GET",
		next: { revalidate: 10 },
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const data: unknown = await res.json();
	return UserDeckSchema.array().parse(data);
};

const Page = async () => {
	const nextCookies = cookies();
	const token = nextCookies.get("accessToken")?.value;

	if (token) {
		const decks = await getDecks(token);
		const communityDecks = await getCommunityDecks(token);

		return (
			<main className="flex justify-start items-center flex-col w-full">
				<div className="background flex flex-col w-full">
					<h2 className="text-2xl font-bold mb-4">Standard Decks</h2>
					<GuestDeck />
				</div>
				<div className="background flex flex-col w-full mt-6">
					<AddDeck />
					<DeckList decks={decks} />
				</div>
				<div className="background flex flex-col w-full mt-6 mb-8">
					<SearchForm />
					{communityDecks
						.sort((a, b) => b.copiedNumber - a.copiedNumber)
						.map((deck) => (
							<Link
								href={`/decks/search/${deck.id}`}
								key={deck.id}
								className="item mt-2 flex justify-between items-center"
							>
								<p>{deck.name}</p>
								<div className="flex items-center">
									<p className="mr-2 mt-1">
										{deck.copiedNumber}
									</p>
									<FaDownload />
								</div>
							</Link>
						))}
				</div>
			</main>
		);
	} else {
		redirect("/guest");
	}
};

export default Page;
