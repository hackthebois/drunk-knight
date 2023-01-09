"use client";

import { FaToggleOff, FaToggleOn } from "react-icons/fa";
import { useAtom } from "jotai";
import { useStandardAtom } from "../play/Play";
import { useQueryClient } from "@tanstack/react-query";

const GuestDeck = () => {
	const [useStandard, setUseStandard] = useAtom(useStandardAtom);
	const queryClient = useQueryClient();

	return (
		<div className={`flex mt-2`}>
			<div className="flex-1 item rounded-r-none border-r-0">
				<p className="flex items-center">Standard Deck</p>
			</div>
			{useStandard ? (
				<div
					className="rounded-l-none items-center w-12 py-2 rounded shadow text-white border-[1px] border-[#ccc] cursor-pointer flex justify-center border-l-0"
					onClick={() => {
						setUseStandard(false);
						queryClient.refetchQueries(["play"]);
					}}
				>
					<FaToggleOn size={24} />
				</div>
			) : (
				<div
					className="rounded-l-none items-center w-12 py-2 rounded shadow text-white border-[1px] border-[#ccc] cursor-pointer flex justify-center border-l-0"
					onClick={() => {
						setUseStandard(true);
						queryClient.refetchQueries(["play"]);
					}}
				>
					<FaToggleOff size={24} />
				</div>
			)}
		</div>
	);
};

export default GuestDeck;
