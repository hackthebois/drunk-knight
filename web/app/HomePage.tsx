"use client";

import { useState } from "react";
import CardItem from "../components/CardItem";
import { Card } from "../types/Card";

const Home = ({ cards }: { cards: Card[] }) => {
	const nextCard = (index: number) => {
		if (cards && index >= cards.length - 1) return 0;
		else return index + 1;
	};

	const [firstCard, setFirstCard] = useState(0);
	const [secondCard, setSecondCard] = useState(nextCard(firstCard));
	const [degrees, setDegrees] = useState(0);
	const [flipped, setFlipped] = useState(false);

	const flipCard = () => {
		setFlipped(!flipped);
		setDegrees(degrees - 180);
		if (flipped) setFirstCard(nextCard(secondCard));
		else setSecondCard(nextCard(firstCard));
	};

	return (
		<main>
			<div
				className="w-full sm:w-[600px] h-[300px] sm:h-[450px] bg-transparent"
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
						<CardItem card={cards[firstCard]} />
					</div>
					<div
						className="absolute w-full h-full"
						style={{
							backfaceVisibility: "hidden",
							transform: "rotateY(180deg)",
						}}
					>
						<CardItem card={cards[secondCard]} />
					</div>
				</div>
			</div>
			<button onClick={flipCard} className="btn mt-8 sm:mt-12">
				Next Card
			</button>
		</main>
	);
};

export default Home;
