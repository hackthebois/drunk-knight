import "../styles/globals.css";
import ClientWrapper from "./ClientWrapper";
import { cookies } from "next/headers";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
	const nextCookies = cookies();
	const token = nextCookies.get("accessToken")?.value;

	return (
		<html lang="en">
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@500&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="bg-background text-white">
				<ClientWrapper token={token}>{children}</ClientWrapper>
			</body>
		</html>
	);
};

export default RootLayout;
