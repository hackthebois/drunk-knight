"use client";

import { useRouter } from "next/navigation";
import { FaPause, FaPlay } from "react-icons/fa";

type Props = {
	useStandard: boolean;
};

const GuestDeck = ({ useStandard }: Props) => {
	const router = useRouter();
	const toggleStandard = async (useStandard: boolean) => {
		await fetch("/api/standard", {
			method: "POST",
			body: JSON.stringify({ useStandard: !useStandard }),
		});
		router.refresh();
	};

	return (
		<div className={`flex mt-2`}>
			<div className="flex-1 item rounded-r-none border-r-0">
				<p className="flex items-center">Standard Deck</p>
			</div>
			{useStandard ? (
				<div
					className="btn rounded-l-none items-center flex"
					onClick={() => toggleStandard(useStandard)}
				>
					<FaPause />
				</div>
			) : (
				<div
					className="btn rounded-l-none flex items-center"
					onClick={() => toggleStandard(useStandard)}
				>
					<FaPlay />
				</div>
			)}
		</div>
	);
};

export default GuestDeck;
