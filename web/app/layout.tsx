import Link from "next/link";
import { FaChessKnight, FaPlay, FaUserCircle } from "react-icons/fa";
import "../styles/globals.css";
import ReactQueryWrapper from "./ReactQueryWrapper";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
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
			<body className="bg-background w-[100vw] h-[100vh] text-white">
				<ReactQueryWrapper>
					{children}
					<nav className="flex flex-row fixed bottom-0 left-0 w-full justify-center items-center border-t-[1px] h-12 bg-background">
						<Link
							href="/decks"
							className="flex-1 p-4 flex justify-center items-center"
						>
							<FaChessKnight size={20} />
						</Link>
						<Link
							href="/"
							className="flex-1 p-4 flex justify-center items-center"
						>
							<FaPlay size={19} />
						</Link>
						<Link
							href="/account"
							className="flex-1 p-4 flex justify-center items-center"
						>
							<FaUserCircle size={20} />
						</Link>
					</nav>
				</ReactQueryWrapper>
			</body>
		</html>
	);
};

export default RootLayout;
