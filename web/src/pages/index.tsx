import type { NextPage } from "next";
import { useState } from "react";
import useReq from "../hooks/useCard";
import { FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/router";
import { Card } from "../types/Card";

const typeColours = {
	CATEGORIES: "449e46",
	ACTION: "#FFA500",
	MEMORY: "#0DA2FF",
	MAJORITY: "#937DC2",
};

const CardItem = ({ id, name, description, card_type }: Card) => {
	return (
		<div
			className="p-8 rounded m-4 w-[90%] max-w-[400px] shadow"
			style={{ backgroundColor: typeColours[card_type] }}
		>
			<h3 className="text-white text-3xl font-bold text-center">{name}</h3>
			<p className="text-white text-lg mt-4 text-center">{description}</p>
		</div>
	);
};

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

const Home: NextPage = () => {
	const { getCard } = useReq();
	const router = useRouter();
	const { data: cards } = getCard;
	return (
		<div className="bg-background h-[100vh] w-[100vw] overflow-hidden flex justify-center items-center flex-col pb-32">
			<div
				className="absolute top-0 right-0 flex justify-center items-center p-4"
				onClick={() => router.push("/info")}
			>
				<FaInfoCircle fill="#ffffff" className="w-6 h-6" />
			</div>
			{cards && <CardStack cards={cards} />}
		</div>
	);
};

export default Home;
