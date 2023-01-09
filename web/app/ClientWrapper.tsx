"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { atom, useAtom } from "jotai";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			suspense: true,
		},
	},
});

export const useStandardAtom = atom(true);
export const tokenAtom = atom("");

const ClientWrapper = ({
	children,
	token,
}: {
	children: React.ReactNode;
	token?: string;
}) => {
	const [_, setToken] = useAtom(tokenAtom);
	setToken(token ?? "");

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

export default ClientWrapper;
