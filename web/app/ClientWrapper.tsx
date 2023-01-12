"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { atom, useAtom } from "jotai";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			suspense: true,
		},
	},
});

export const excludeDeckIdsAtom = atom<string[]>([]);
export const tokenAtom = atom("");

const ClientWrapper = ({
	children,
	token,
}: {
	children: React.ReactNode;
	token?: string;
}) => {
	const [t, setToken] = useAtom(tokenAtom);
	setToken(token ?? "");

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
			<Toaster />
		</QueryClientProvider>
	);
};

export default ClientWrapper;
