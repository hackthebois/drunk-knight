import type { NextPage } from "next";
import { useState } from "react";
import CardItem from "../components/CardItem";
import useReq from "../hooks/useCard";
import { FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/router";
import CardStack from "../components/CardStack";

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
