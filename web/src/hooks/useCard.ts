import { useQuery } from "@tanstack/react-query";
import { Card, CardSchema } from "../types/Card";

const getCardRequest = async () => {
	// const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/card`);
	// const data: unknown = await res.json();
	// const cards = await CardSchema.array().parse(data);

	const cards: Card[] = [
		{
			id: "1",
			name: "Alphabet",
			description: "Say the ABCs backwards, drink a second for each letter you didn't get",
			card_type: "ACTION",
		},
		{
			id: "2",
			name: "Dog Breads",
			description: "Go clockwise naming dog breads, first to fail drinks",
			card_type: "CATEGORIES",
		},
		{
			id: "3",
			name: "Favourite Colour",
			description: "If you share a favourite colour with another player, drink",
			card_type: "MAJORITY",
		},
	];
	return cards;
};

const useCard = () => {
	const getCard = useQuery(["card"], getCardRequest);

	return { getCard };
};

export default useCard;
