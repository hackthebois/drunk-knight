import { useState } from "react";
import { Card } from "../types/Card";

const typeColours = {
	CATEGORIES: "#449e46",
	ACTION: "#FFA500",
	MEMORY: "#0DA2FF",
	MAJORITY: "#937DC2",
};

const CardItem = ({ name, description, cardType }: Card) => {
	return (
		<div className="w-full h-full text-text flex flex-col shadow">
			<div
				className="p-4 relative flex items-start justify-between rounded-t"
				style={{ backgroundColor: typeColours[cardType] }}
			>
				<div className="bg-white flex p-2 items-center rounded font-bold h-10">
					{cardType}
				</div>
			</div>
			<div className="bg-white p-8 flex-1 rounded-b">
				<h3 className="text-2xl font-bold text-left">{name}</h3>
				<p className="text-lg mt-4 text-left">{description}</p>
			</div>
		</div>
	);
};

const Cards = ({ cards }: { cards: Card[] }) => {
	const [firstCard, setFirstCard] = useState(0);
	const [secondCard, setSecondCard] = useState(1);
	const [degrees, setDegrees] = useState(0);
	const [flipped, setFlipped] = useState(false);

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

	if (cards.length < 2) {
		return <div>Not enough cards.</div>;
	}

	return (
		<>
			<div
				className="w-[100vw] sm:w-[600px] h-96 sm:h-[450px] p-8 bg-transparent"
				style={{ perspective: 1000 }}
			>
				<div
					className="relative w-full h-full duration-1000"
					style={{
						transform: `rotateY(${degrees}deg)`,
						transformStyle: "preserve-3d",
					}}
				>
					<div
						className="absolute w-full h-full"
						style={{ backfaceVisibility: "hidden" }}
					>
						<CardItem {...cards[firstCard]} />
					</div>
					<div
						className="absolute w-full h-full"
						style={{
							backfaceVisibility: "hidden",
							transform: "rotateY(180deg)",
						}}
					>
						<CardItem {...cards[secondCard]} />
					</div>
				</div>
			</div>
			<button
				onClick={flipCard}
				className="bg-white font-bold px-4 py-2 mt-8 sm:mt-12 rounded text-lg shadow text-text"
			>
				Next Card
			</button>
		</>
	);
};

export default Cards;
