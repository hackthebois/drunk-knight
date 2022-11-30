import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { env } from "../../../../../env/client.mjs";
import { z } from "zod";
import { CardSchema } from "../../../../../types/Card";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa";
import CardItem from "../../../../../components/CardItem";
import CopyDeck from "./CopyDeck";

const SearchDeckSchema = z.object({
	name: z.string(),
	cards: CardSchema.array(),
});

type Props = {
	params: {
		deckId: string;
	};
};

const getDeck = async ({
	deckId,
	token,
}: {
	deckId: string;
	token: string;
}) => {
	const res = await fetch(
		`${env.NEXT_PUBLIC_SERVER_URL}/search/deck/${deckId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	);
	const data: unknown = await res.json();
	console.log(data);
	if (res.status === 404) {
		return undefined;
	} else {
		return SearchDeckSchema.parse(data);
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

		return (
			<main className="flex justify-start items-center flex-col w-full">
				<div className="background flex flex-col w-full mt-6">
					<div className="flex justify-between mb-8">
						<Link className="gbtn mr-3" href={"/decks/search"}>
							<FaAngleLeft />
						</Link>
						<CopyDeck deckId={deckId} />
					</div>
					<h2 className="text-2xl font-bold mb-2">{deck.name}</h2>
					{deck.cards &&
						deck.cards.map((card) => (
							<div key={card.id} className="mt-4">
								<CardItem card={card} />
							</div>
						))}
				</div>
			</main>
		);
	} else {
		redirect("/auth/signin");
	}
};

export default Page;
