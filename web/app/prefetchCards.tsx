"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { play } from "./(game)/play/Play";
import { tokenAtom, excludeDeckIdsAtom } from "./ClientWrapper";

const PrefetchCards = () => {
	const queryClient = useQueryClient();
	const [token] = useAtom(tokenAtom);
	const [excludeDeckIds] = useAtom(excludeDeckIdsAtom);

	queryClient.prefetchQuery({
		queryKey: ["play", token, excludeDeckIds],
		queryFn: () =>
			play({
				token,
				excludeDeckIds,
				reset: () => console.log("no reset"),
			}),
	});

	return <></>;
};

export default PrefetchCards;
