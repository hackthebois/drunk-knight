import Link from "next/link";
import { FaPlay, FaUserCircle } from "react-icons/fa";
import { CgCardClubs, CgCardDiamonds, CgCardHearts } from "react-icons/cg";
import { cookies } from "next/headers";

const Layout = async ({ children }: { children: React.ReactNode }) => {
	const nextCookies = cookies();
	const token = nextCookies.get("accessToken")?.value;

	return (
		<>
			{children}
			<nav className="flex flex-row w-full fixed bottom-0 justify-center border-t-[1px] h-12 bg-background">
				<Link
					href={token ? "/decks" : "/decks/guest"}
					className="flex-1 flex justify-center items-center hover:bg-white hover:bg-opacity-5 mb-1"
				>
					<CgCardDiamonds
						size={20}
						className="-rotate-[20deg] -mr-[10px] mt-1"
					/>
					<CgCardHearts size={20} className="bg-background z-10" />
					<CgCardClubs
						size={20}
						className="rotate-[20deg] -ml-[10px] mt-1"
					/>
				</Link>
				<Link
					href="/play"
					className="flex-1 flex justify-center items-center hover:bg-white hover:bg-opacity-5"
				>
					<FaPlay size={19} />
				</Link>
				<Link
					href={token ? "/account" : "/account/guest"}
					className="flex-1 flex justify-center items-center hover:bg-white hover:bg-opacity-5"
				>
					<FaUserCircle size={20} />
				</Link>
			</nav>
		</>
	);
};

export default Layout;
