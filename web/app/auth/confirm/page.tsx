import { cookies } from "next/headers";
import { env } from "../../../env/client.mjs";
import { UserSchema } from "../../../types/User.js";
import Confirm from "./ConfirmPage";

export const getUser = async ({ token }: { token: string }) => {
	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/account`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const data: unknown = await res.json();
	return UserSchema.parse(data);
};

const Page = async () => {
	const nextCookies = cookies();
	const token = nextCookies.get("accessToken")?.value;
	const user = token ? await getUser({ token }) : null;

	return <Confirm user={user} />;
};

export default Page;
