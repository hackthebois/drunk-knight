import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { env } from "../../../env/client.mjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { cookies } = req;

	const jwt = cookies.accessToken;

	const user = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/account`, {
		method: "DELETE",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
	});

	if (!user.ok) {
		return res.status(user.status).json({ message: user.statusText });
	}

	if (jwt) {
		const serialized = serialize("accessToken", "", {
			httpOnly: true,
			sameSite: "strict",
			maxAge: -1,
			path: "/",
		});
		res.setHeader("Set-Cookie", serialized);
		res.status(200).json({ message: "Success." });
	}
};

export default handler;
