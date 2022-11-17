"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";

type Props = {
	useStandard: boolean;
};

const updateStandard = async (useStandard: boolean) => {
	const res = await fetch("/api/standard", {
		method: "POST",
		body: JSON.stringify({ useStandard }),
	});
	if (!res.ok) throw new Error("Error updating standard deck.");
};

const GuestDeck = ({ useStandard }: Props) => {
	const router = useRouter();
	const [isSelected, setIsSelected] = useState(useStandard);

	const updateStandardMutation = useMutation(updateStandard);

	return (
		<div className={`flex mt-2`}>
			<div className="flex-1 item rounded-r-none border-r-0">
				<p className="flex items-center">Standard Deck</p>
			</div>
			{isSelected ? (
				<div
					className="rounded-l-none items-center flex w-12 py-2 rounded shadow text-white border-[1px] border-[#ccc] cursor-pointer flex justify-center border-l-0"
					onClick={() => {
						setIsSelected(false);
						updateStandardMutation.mutate(false, {
							onSettled: () => router.refresh(),
							onError: () => {
								setIsSelected(true);
							},
						});
					}}
				>
					<FaToggleOn size={24} />
				</div>
			) : (
				<div
					className="rounded-l-none items-center flex w-12 py-2 rounded shadow text-white border-[1px] border-[#ccc] cursor-pointer flex justify-center border-l-0"
					onClick={() => {
						setIsSelected(true);
						updateStandardMutation.mutate(true, {
							onSettled: () => router.refresh(),
							onError: () => {
								setIsSelected(false);
							},
						});
					}}
				>
					<FaToggleOff size={24} />
				</div>
			)}
		</div>
	);
};

export default GuestDeck;
