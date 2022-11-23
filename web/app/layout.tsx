import Link from "next/link";
import { FaPlay, FaUserCircle } from "react-icons/fa";
import {
	CgCardClubs,
	CgCardDiamonds,
	CgCardHearts,
	CgCardSpades,
} from "react-icons/cg";
import "../styles/globals.css";
import ClientWrapper from "./ClientWrapper";
import { cookies } from "next/headers";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
	const nextCookies = cookies();
	const token = nextCookies.get("accessToken")?.value;

	return (
		<html lang="en">
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@500&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="bg-background text-white">
				<ClientWrapper>
					{children}
					<nav className="flex flex-row w-full fixed bottom-0 justify-center border-t-[1px] h-12 bg-background">
						<Link
							href="/decks"
							className="flex-1 flex justify-center items-center hover:bg-white hover:bg-opacity-5"
						>
							<CgCardDiamonds
								size={24}
								className="-rotate-[20deg] -mr-[10px] mt-1"
							/>
							<CgCardHearts
								size={24}
								className="bg-background z-10"
							/>
							<CgCardClubs
								size={24}
								className="rotate-[20deg] -ml-[10px] mt-1"
							/>
						</Link>
						<Link
							href="/"
							className="flex-1 flex justify-center items-center hover:bg-white hover:bg-opacity-5"
						>
							<FaPlay size={19} />
						</Link>
						<Link
							href="/account"
							className="flex-1 flex justify-center items-center hover:bg-white hover:bg-opacity-5"
						>
							<FaUserCircle size={20} />
						</Link>
					</nav>
				</ClientWrapper>
			</body>
		</html>
	);
};

export default RootLayout;
