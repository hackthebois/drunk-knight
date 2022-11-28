import Image from "next/image";
import Link from "next/link";
import { FaChessKnight } from "react-icons/fa";

const Page = () => {
	return (
		<main className="flex justify-center items-center flex-col w-full h-[85vh]">
			<div className="background flex flex-col justify-center items-center">
				<div className="flex">
					<FaChessKnight
						color="#fff"
						className="w-20 h-20 md:w-32 md:h-32 mb-2 mr-2 md:mr-4"
					/>
					<div className="flex flex-col items-between justify-between">
						<h2 className="text-4xl md:text-6xl text-center font-bold">
							Drunk
						</h2>
						<h2 className="text-4xl md:text-6xl text-center font-bold">
							Knight
						</h2>
					</div>
				</div>
				<p className="md:text-lg mt-8 text-center">
					Flip the card, do what it says. It is that simple!
				</p>
				<Link className="btn mt-8 w-full text-center" href="/play">
					Play
				</Link>
			</div>
		</main>
	);
};

export default Page;
