"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext } from "react";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			suspense: true,
		},
	},
});

export const AuthContext = createContext<string>("");

const ClientWrapper = ({
	children,
	token,
}: {
	children: React.ReactNode;
	token?: string;
}) => {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthContext.Provider value={token ?? ""}>
				{children}
				<ReactQueryDevtools initialIsOpen={false} />
			</AuthContext.Provider>
		</QueryClientProvider>
	);
};

export default ClientWrapper;
