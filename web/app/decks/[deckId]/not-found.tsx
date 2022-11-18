import Link from "next/link";

const NotFound = () => {
	return (
		<main className="flex justify-center items-center flex-col w-full h-[85vh]">
			<h2 className="text-xl md:text-2xl mb-4 text-center background">
				Could not find deck.
			</h2>
		</main>
	);
};

export default NotFound;
