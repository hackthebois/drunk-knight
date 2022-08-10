import type { NextPage } from "next";
import { useState } from "react";
import useReq from "../hooks/useCard";
import { FaGlassWhiskey, FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/router";
import { Card } from "../types/Card";

const typeColours = {
	CATEGORIES: "#449e46",
	ACTION: "#FFA500",
	MEMORY: "#0DA2FF",
	MAJORITY: "#937DC2",
};

const CardItem = ({ name, description, card_type }: Card) => {
	return (
		<div className="max-w-[400px] min-w-[300px]">
			<div
				className="rounded-t w-[100%] shadow h-24 relative flex items-start justify-between p-4"
				style={{ backgroundColor: typeColours[card_type] }}
			>
				<div className="bg-white flex p-2 items-center rounded text-text font-bold h-10">
					{card_type}
				</div>
				<div className="bg-white flex p-2 items-center rounded text-text h-10">
					<p className="font-bold mr-1 text-lg">2</p> <FaGlassWhiskey />
				</div>
			</div>
			<div className="bg-white p-8 rounded-b w-[100%]">
				<h3 className="text-text text-2xl font-bold text-left">{name}</h3>
				<p className="text-text text-lg mt-4 text-left">{description}</p>
			</div>
		</div>
	);
};

const Home: NextPage = () => {
	const { getCard } = useReq();
	const router = useRouter();
	const { data: cards } = getCard;
	const [cardNum, setCardNum] = useState(0);

	const nextCard = () => {
		if (cards && cardNum >= cards.length - 1) setCardNum(0);
		else setCardNum(cardNum + 1);
	};

	return (
		<div className="bg-background h-[100vh] w-[100vw] overflow-hidden flex justify-center items-center flex-col pb-32">
			<div
				className="absolute top-0 right-0 flex justify-center items-center p-4"
				onClick={() => router.push("/info")}
			>
				<FaInfoCircle fill="#ffffff" className="w-6 h-6" />
			</div>
			{cards && <CardItem {...cards[cardNum]} />}
			<button
				onClick={nextCard}
				className="bg-white font-bold px-4 py-2 mt-4 rounded text-lg shadow"
			>
				Next Card
			</button>
		</div>
	);
};

export default Home;
