import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { env } from "../../../env/client.mjs";
import { DeckSchema } from "../../../types/Deck";
import DeckPage from "./DeckPage";

type Props = {
	params: {
		id: string;
	};
};

const getDeck = async ({ id, token }: { id: string; token: string }) => {
	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/deck/${id}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const data: unknown = await res.json();
	return DeckSchema.parse(data);
};

const Page = async ({ params: { id } }: Props) => {
	const nextCookies = cookies();
	const token = nextCookies.get("accessToken")?.value;

	if (token) {
		const deck = await getDeck({ id, token });

		return <DeckPage deck={deck} />;
	} else {
		redirect("/auth/signin");
	}
};

export default Page;
