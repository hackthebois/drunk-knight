import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { serialize } from "cookie";
import { SignInInputSchema } from "../../../app/(game)/auth/signin/SignInPage";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const input = SignInInputSchema.parse(req.body);

	const user = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/signin`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(input),
		},
	);
	const data = await user.json();
	if (!user.ok) {
		return res.status(user.status).json({ message: data.message });
	}

	const { token } = z.object({ token: z.string() }).parse(data);

	const serialized = serialize("accessToken", token, {
		httpOnly: true,
		sameSite: "strict",
		maxAge: 60 * 60 * 10,
		path: "/",
	});

	res.setHeader("Set-Cookie", serialized);
	res.status(200).json({ token });
};

export default handler;
