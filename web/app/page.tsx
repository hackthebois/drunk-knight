import { env } from "../env/client.mjs";
import { CardSchema } from "../types/Card";
import Home from "./HomePage";

const play = async () => {
	// const accessToken = localStorage.getItem("access_token");
	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/play`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `${
				// accessToken && accessToken !== "" ? `Bearer ${accessToken}` : ""
				""
			}`,
		},
	});
	const data: unknown = await res.json();
	return await CardSchema.array().min(1).parse(data);
};

const Page = async () => {
	const cards = await play();

	return <Home cards={cards} />;
};

export default Page;
