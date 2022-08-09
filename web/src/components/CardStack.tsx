import { useState } from "react";
import Card from "../types/Card";
import { motion } from "framer-motion";
import CardItem from "./CardItem";

type Props = {
	cards: Card[];
};

const CardStack = ({ cards }: Props) => {
	const [cardNum, setCardNum] = useState(0);

	const nextCard = () => {
		if (cards && cardNum >= cards.length - 1) setCardNum(0);
		else setCardNum(cardNum + 1);
	};

	return (
		<>
			{cards && <CardItem {...cards[cardNum]} />}
			<button
				onClick={nextCard}
				className="bg-white font-bold px-4 py-2 mt-4 rounded text-lg shadow"
			>
				Next Card
			</button>
		</>
	);
};

export default CardStack;
