"use client";

import { useQuery } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import { useContext, useState } from "react";
import CardItem from "../components/CardItem";
import { env } from "../env/client.mjs";
import { CardSchema } from "../types/Card";
import { AuthContext } from "./ClientWrapper";
import { atomWithReset, useResetAtom } from "jotai/utils";
import Loader from "../components/Loader";

export const useStandardAtom = atom(true);
const playAtom = atomWithReset({
	firstCard: 0,
	secondCard: 0,
	degrees: 0,
	flipped: false,
});

const play = async ({
	token,
	useStandard,
	reset,
}: {
	token?: string;
	useStandard: boolean;
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
			useStandard,
		}),
	});
	const data: unknown = await res.json();
	reset();
	return await CardSchema.array().parse(data);
};

const Play = () => {
	const token = useContext(AuthContext);
	const [useStandard] = useAtom(useStandardAtom);
	const resetPlay = useResetAtom(playAtom);
	const [{ firstCard, secondCard, degrees, flipped }, setPlay] =
		useAtom(playAtom);

	console.log(firstCard, secondCard);

	const { data: cards } = useQuery(
		["play", token, useStandard],
		() =>
			play({
				token,
				useStandard: token === "" ? true : useStandard,
				reset: () => resetPlay(),
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

	const flipCard = () => {
		setPlay({
			flipped: !flipped,
			degrees: degrees - 180,
			firstCard: flipped ? nextCard(secondCard) : firstCard,
			secondCard: flipped ? secondCard : nextCard(firstCard),
		});
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
						className={`w-full sm:w-[600px] h-[300px] sm:h-[450px] bg-transparent`}
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
				</>
			) : (
				<Loader visible />
			)}
		</main>
	);
};

export default Play;
