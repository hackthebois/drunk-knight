"use client";

import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import CardItem from "../../../components/CardItem";
import { env } from "../../../env/client.mjs";
import { CardSchema } from "../../../types/Card";
import { tokenAtom, excludeDeckIdsAtom } from "../../ClientWrapper";
import { atomWithReset, useResetAtom } from "jotai/utils";
import Loader from "../../../components/Loader";
import { useState } from "react";
import Image from "next/image";

const playAtom = atomWithReset({
	currentCard: 0,
	degrees: 0,
});

export const play = async ({
	token,
	excludeDeckIds,
	reset,
}: {
	token?: string;
	excludeDeckIds: string[];
	reset: () => void;
}) => {
	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/play`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `${token && token !== "" ? `Bearer ${token}` : ""}`,
		},
		body: JSON.stringify({
			excludeDeckIds,
		}),
	});
	const data: unknown = await res.json();
	reset();
	return await CardSchema.array().parse(data);
};

const Play = () => {
	const [token] = useAtom(tokenAtom);
	const [excludeDeckIds] = useAtom(excludeDeckIdsAtom);
	const resetPlay = useResetAtom(playAtom);
	const [{ currentCard, degrees }, setPlay] = useAtom(playAtom);
	const [canFlip, setCanFlip] = useState(true);

	const { data: cards } = useQuery(
		["play", token, excludeDeckIds],
		() =>
			play({
				token,
				excludeDeckIds,
				reset: () => {
					resetPlay();
				},
			}),
		{
			cacheTime: Infinity,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			suspense: false,
		},
	);

	const nextCard = (index: number) => {
		if (cards && index >= cards.length - 1) return 0;
		else return index + 1;
	};

	const flipCard = (currentPlay: {
		currentCard: number;
		degrees: number;
	}) => {
		if (canFlip) {
			setPlay({
				degrees: currentPlay.degrees - 180,
				currentCard: currentPlay.currentCard,
			});
			setCanFlip(false);
			setTimeout(() => {
				setPlay({
					degrees: currentPlay.degrees - 360,
					currentCard: nextCard(currentPlay.currentCard),
				});
				setCanFlip(true);
			}, 1000);
		}
	};

	if (cards && cards.length < 1) {
		return (
			<main className="flex justify-center items-center flex-col w-full h-[85vh]">
				<h2 className="text-xl md:text-2xl mb-4 text-center background">
					No cards found. Select a deck!
				</h2>
			</main>
		);
	}

	return (
		<main className="flex justify-center items-center flex-col w-full h-[85vh]">
			{cards ? (
				<>
					<div
						className={`w-full sm:w-[550px] h-[300px] sm:h-[400px] bg-transparent`}
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
								<CardItem card={cards[currentCard]} />
							</div>
							<div
								className="absolute w-full h-full"
								style={{
									backfaceVisibility: "hidden",
									transform: "rotateY(180deg)",
								}}
							>
								<div className="w-full h-full flex flex-col justify-center items-center shadow bg-lightbackground rounded">
									<Image
										src="/logo.png"
										height={100}
										width={100}
										alt="Drunk knight logo of knight helmet with beer flowing out"
									/>
								</div>
							</div>
						</div>
					</div>
					<button
						onClick={() => flipCard({ currentCard, degrees })}
						className="btn mt-8 sm:mt-12"
					>
						Next Card
					</button>
				</>
			) : (
				<Loader visible />
			)}
		</main>
	);
};

export default Play;
