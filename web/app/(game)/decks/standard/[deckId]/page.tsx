import { z } from "zod";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa";
import { CardSchema } from "../../../../../types/Card";
import { env } from "../../../../../env/client.mjs";
import CardItem from "../../../../../components/CardItem";
import { notFound } from "next/navigation";

const StandardDeckSchema = z.object({
	name: z.string(),
	cards: CardSchema.array(),
});
export type StandardDeck = z.input<typeof StandardDeckSchema>;

type Props = {
	params: {
		deckId: string;
	};
};

const getStandardDeck = async (deckId: string) => {
	const res = await fetch(
		`${env.NEXT_PUBLIC_SERVER_URL}/standard/${deckId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		},
	);
	const data: unknown = await res.json();
	if (res.status === 404) {
		return undefined;
	} else {
		return StandardDeckSchema.parse(data);
	}
};

const Page = async ({ params: { deckId } }: Props) => {
	const deck = await getStandardDeck(deckId);

	if (!deck) {
		notFound();
	}

	return (
		<main className="flex justify-start items-center flex-col w-full">
			<div className="background flex flex-col w-full mt-6">
				<div className="flex justify-between mb-8">
					<Link className="gbtn mr-3" href={"/decks"}>
						<FaAngleLeft />
					</Link>
				</div>
				<h2 className="text-2xl font-bold mb-2">{deck.name}</h2>
				{deck &&
					deck.cards &&
					deck.cards.map((card) => (
						<div key={card.id} className="mt-4">
							<CardItem card={card} />
						</div>
					))}
			</div>
		</main>
	);
};

export default Page;
