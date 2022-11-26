import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { cookies } = req;

	const jwt = cookies.accessToken;

	if (jwt) {
		const serialized = serialize("accessToken", "", {
			httpOnly: true,
			sameSite: "strict",
			maxAge: -1,
			path: "/",
		});
		res.setHeader("Set-Cookie", serialized);
		return res.status(200).json({ message: "Success." });
	}
};

export default handler;
