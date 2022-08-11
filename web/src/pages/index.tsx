import type { NextPage } from "next";
import { useState } from "react";
import useReq from "../hooks/useCard";
import { useRouter } from "next/router";
import { Card } from "../types/Card";
import useAuth from "../hooks/useAuth";

const typeColours = {
	CATEGORIES: "#449e46",
	ACTION: "#FFA500",
	MEMORY: "#0DA2FF",
	MAJORITY: "#937DC2",
};

const CardItem = ({ name, description, card_type }: Card) => {
	return (
		<>
			<div
				className="rounded-t w-[100%] shadow p-4 relative flex items-start justify-between"
				style={{ backgroundColor: typeColours[card_type] }}
			>
				<div className="bg-white flex p-2 items-center rounded font-bold h-10">
					{card_type}
				</div>
				{/* <div className="bg-white flex p-2 items-center rounded h-10">
					<p className="font-bold mr-1 text-lg">2</p> <FaGlassWhiskey />
				</div> */}
			</div>
			<div className="bg-white p-8 rounded-b w-[100%] h-[75%]">
				<h3 className="text-2xl font-bold text-left">{name}</h3>
				<p className="text-lg mt-4 text-left">{description}</p>
			</div>
		</>
	);
};

const Home: NextPage = () => {
	const { getCard } = useReq();
	const { data: cards } = getCard;
	const [firstCard, setFirstCard] = useState(0);
	const [secondCard, setSecondCard] = useState(1);
	const [degrees, setDegrees] = useState(0);
	const [flipped, setFlipped] = useState(false);
	const { user } = useAuth();
	const { data } = user;

	const nextCard = (index: number) => {
		if (cards && index >= cards.length - 1) return 0;
		else return index + 1;
	};

	const flipCard = () => {
		setFlipped(!flipped);
		setDegrees(degrees - 180);
		if (flipped) setFirstCard(nextCard(secondCard));
		else setSecondCard(nextCard(firstCard));
	};

	return (
		<div className="flex justify-center items-center flex-col h-full w-full">
			{cards && (
				<div className="w-96 h-64 bg-transparent" style={{ perspective: 1000 }}>
					<div
						className="relative w-full h-full duration-1000"
						style={{
							transform: `rotateY(${degrees}deg)`,
							transformStyle: "preserve-3d",
						}}
					>
						<div
							className="shadow absolute w-full h-full"
							style={{ backfaceVisibility: "hidden" }}
						>
							<CardItem {...cards[firstCard]} />
						</div>
						<div
							className="shadow absolute w-full h-full"
							style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
						>
							<CardItem {...cards[secondCard]} />
						</div>
					</div>
				</div>
			)}
			<button
				onClick={flipCard}
				className="bg-white font-bold px-4 py-2 mt-16 rounded text-lg shadow"
			>
				Next Card
			</button>
		</div>
	);
};

export default Home;
