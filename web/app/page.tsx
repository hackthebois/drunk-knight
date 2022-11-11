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
	const cards = await play({
		token: nextCookies.get("accessToken")?.value,
		useStandard:
			nextCookies.get("useStandard")?.value === "false" ? false : true,
	});

	if (cards.length < 1) {
		throw new Error("No cards found. Select a deck.");
	}

	return <Home cards={cards} />;
};

export default Page;
