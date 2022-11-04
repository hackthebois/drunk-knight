import { env } from "../env/client.mjs";
import { CardSchema } from "../types/Card";
import Home from "./HomePage";
import { cookies } from "next/headers";

const play = async ({ token }: { token?: string }) => {
	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/play`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `${token && token !== "" ? `Bearer ${token}` : ""}`,
		},
	});
	const data: unknown = await res.json();
	return await CardSchema.array().min(1).parse(data);
};

const Page = async () => {
	const nextCookies = cookies();
	const cards = await play({ token: nextCookies.get("accessToken")?.value });

	return <Home cards={cards} />;
};

export default Page;
