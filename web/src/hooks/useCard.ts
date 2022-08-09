import { useQuery } from "react-query";
import Card from "../types/Card";

const cards: Card[] = [
	{
		id: 1,
		name: "Alphabet",
		description: "Say the ABCs backwards, drink a second for each letter you didn't get",
		type: "memory",
	},
	{
		id: 3,
		name: "Dog Breads",
		description: "Go clockwise naming dog breads, first to fail drinks",
		type: "categories",
	},
	{
		id: 2,
		name: "Favourite Colour",
		description: "If you share a favourite colour with another player, drink",
		type: "majority",
	},
];

const getCardRequest = async () => {
	// const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
	// const data = await res.data;

	return cards;
};

const useCard = () => {
	const getCard = useQuery("card", getCardRequest);

	return { getCard };
};

export default useCard;
