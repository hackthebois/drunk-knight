import { env } from "../env/client.mjs";
import { CardSchema } from "../types/Card";
import Home from "./HomePage";
import { cookies } from "next/headers";

const play = async ({
	token,
	useStandard,
}: {
	token?: string;
	useStandard: boolean;
}) => {
	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/play`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `${token && token !== "" ? `Bearer ${token}` : ""}`,
		},
		body: JSON.stringify({
			useStandard,
		}),
	});
	const data: unknown = await res.json();
	return await CardSchema.array().parse(data);
};

const Page = async () => {
	const nextCookies = cookies();
	const token = nextCookies.get("accessToken")?.value;
	const useStandard =
		nextCookies.get("useStandard")?.value === "false" ? false : true;
	const cards = await play({
		token,
		useStandard,
	});

	if (cards.length < 1) {
		return (
			<main>
				<h2 className="text-xl md:text-2xl mb-4 text-center">
					No cards found. Select a deck!
				</h2>
			</main>
		);
	}

	return <Home cards={cards} />;
};

export default Page;
