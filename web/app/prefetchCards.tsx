"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { play } from "./(game)/play/Play";
import { tokenAtom, useStandardAtom } from "./ClientWrapper";

const PrefetchCards = () => {
	const queryClient = useQueryClient();
	const [token] = useAtom(tokenAtom);
	const [useStandard] = useAtom(useStandardAtom);

	queryClient.prefetchQuery({
		queryKey: ["play", token, useStandard],
		queryFn: () =>
			play({
				token,
				useStandard: token === "" ? true : useStandard,
				reset: () => console.log("no reset"),
			}),
	});

	return <></>;
};

export default PrefetchCards;
