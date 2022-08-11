import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";

function MyApp({ Component, pageProps }: AppProps) {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<div className="m-auto max-w-screen-lg h-[100vh] p-20">
				<Component {...pageProps} />
			</div>
		</QueryClientProvider>
	);
}

export default MyApp;
