import { cookies } from "next/headers";
import { env } from "../../env/client.mjs";
import { UserSchema } from "../../types/User";
import { redirect } from "next/navigation";
import Profile from "./Profile";

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
	if (res.status === 403) {
		redirect("/guest");
	} else {
		return UserSchema.parse(data);
	}
};

const Page = async () => {
	const nextCookies = cookies();
	const token = nextCookies.get("accessToken")?.value;

	if (token) {
		const user = await getUser({ token });

		return (
			<main className="flex justify-center items-center flex-col w-full h-[85vh]">
				<div className="background w-full">
					<Profile user={user} />
				</div>
			</main>
		);
	} else {
		redirect("/guest");
	}
};

export default Page;
