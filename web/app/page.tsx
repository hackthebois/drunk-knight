import Image from "next/image";
import Link from "next/link";
import PrefetchCards from "./prefetchCards";

const Page = () => {
	return (
		<main className="flex justify-center items-center flex-col w-full h-[85vh]">
			<PrefetchCards />
			<div className="background flex flex-col justify-center items-center">
				<div className="flex flex-col justify-center items-center">
					<Image
						src="/logo.png"
						height={100}
						width={100}
						alt="Drunk knight logo of knight helmet with beer flowing out"
						className="mb-8"
					/>
					<h2 className="text-3xl sm:text-5xl text-center font-bold">
						Drunk Knight
					</h2>
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
