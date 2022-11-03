import Link from "next/link";
import "../styles/globals.css";
import ReactQueryWrapper from "./ReactQueryWrapper";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
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
			<body>
				<ReactQueryWrapper>{children}</ReactQueryWrapper>
			</body>
		</html>
	);
};

export default RootLayout;
