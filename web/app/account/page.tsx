import { cookies } from "next/headers";
import { env } from "../../env/client.mjs";
import { UserSchema } from "../../types/User";
import Account from "./AccountPage";
import GuestPage from "./GuestPage";

const getUser = async ({ token }: { token: string }) => {
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

	if (token) {
		const user = await getUser({ token });

		return <Account user={user} />;
	} else {
		return <GuestPage />;
	}
};

export default Page;
