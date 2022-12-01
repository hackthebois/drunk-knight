import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AddDeck from "./AddDeck";
import GuestDeck from "./GuestDeck";
import DeckList from "./DeckList";
import { env } from "../../../env/client.mjs";
import { DeckSchema } from "../../../types/Deck";
import { FaSearch, FaTrash } from "react-icons/fa";
import Link from "next/link";

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

	if (token) {
		const decks = await getDecks(token);
		return (
			<main className="flex justify-start items-center flex-col w-full">
				<div className="background flex flex-col w-full">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-2xl font-bold">Decks</h2>
						<Link className="btn" href="/decks/search">
							<FaSearch />
						</Link>
					</div>
					<GuestDeck />
					<DeckList decks={decks} />
					<AddDeck />
				</div>
			</main>
		);
	} else {
		redirect("/guest");
	}
};

export default Page;
