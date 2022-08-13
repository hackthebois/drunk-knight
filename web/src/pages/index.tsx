import type { NextPage } from "next";
import { useState } from "react";
import { Card } from "../types/Card";
import useAuth from "../hooks/useAuth";
import { FaUserCircle, FaUserAlt, FaSignOutAlt } from "react-icons/fa";
import { CgCardHearts } from "react-icons/cg";
import { Menu, Transition } from "@headlessui/react";
import useCard from "../hooks/useCard";
import Link from "next/link";
import { useRouter } from "next/router";

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
	const { getCard } = useCard();
	const { data: cards } = getCard;
	const [firstCard, setFirstCard] = useState(0);
	const [secondCard, setSecondCard] = useState(1);
	const [degrees, setDegrees] = useState(0);
	const [flipped, setFlipped] = useState(false);
	const { getUser, signout } = useAuth();
	const router = useRouter();
	const { data: user } = getUser;

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
	console.log(user);

	return (
		<div className="flex justify-center items-center flex-col h-full w-full">
			<>
				{user && (
					<div className="absolute right-4 top-4">
						<Menu as="div" className="relative">
							<Menu.Button className="p-4 flex items-center justify-center cursor-pointer">
								<FaUserCircle color="white" size={28} />
							</Menu.Button>
							<Transition
								enter="transition duration-100 ease-out"
								enterFrom="transform scale-95 opacity-0"
								enterTo="transform scale-100 opacity-100"
								leave="transition duration-75 ease-out"
								leaveFrom="transform scale-100 opacity-100"
								leaveTo="transform scale-95 opacity-0"
							>
								<Menu.Items className="absolute right-0 origin-top-right bg-white w-48 rounded text-textdark text-start p-1 mr-4">
									<Menu.Item>
										{({ active }) => (
											<button
												className={`${
													active && "bg-background text-white"
												} flex items-center p-2 w-full rounded font-bold`}
												onClick={() => router.push("/cards")}
											>
												<CgCardHearts
													className="mr-2 -ml-[2px]"
													size={21}
												/>{" "}
												Cards
											</button>
										)}
									</Menu.Item>
									<Menu.Item>
										{({ active }) => (
											<button
												className={`${
													active ? "bg-background text-white" : ""
												} flex items-center p-2 w-full rounded font-bold`}
												onClick={() => router.push("/profile")}
											>
												<FaUserAlt className="mr-2" size={18} /> Profile
											</button>
										)}
									</Menu.Item>
									<Menu.Item>
										{({ active }) => (
											<button
												className={`${
													active ? "bg-background text-white" : ""
												} flex items-center p-2 w-full rounded font-bold`}
												onClick={() => signout()}
											>
												<FaSignOutAlt className="mr-2" size={20} /> Sign out
											</button>
										)}
									</Menu.Item>
								</Menu.Items>
							</Transition>
						</Menu>
					</div>
				)}
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
								style={{
									backfaceVisibility: "hidden",
									transform: "rotateY(180deg)",
								}}
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
				{!user && (
					<div className="text-white absolute bottom-4">
						Your are playing as guest.{" "}
						<Link href="/auth/signin">
							<a className=" text-blue-400">Sign in</a>
						</Link>{" "}
						or{" "}
						<Link href="/auth/signup">
							<a className=" text-blue-400">Sign up</a>
						</Link>
					</div>
				)}
			</>
		</div>
	);
};

export default Home;
