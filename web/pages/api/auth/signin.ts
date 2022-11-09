import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { SignInInputSchema } from "../../../app/auth/signin/SignInPage";
import { serialize } from "cookie";

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
	const data: any = await user.json();
	if (!user.ok) throw new Error((data && data.message) || res.status);

	const { token } = z.object({ token: z.string() }).parse(data);

	const serialized = serialize("accessToken", token, {
		httpOnly: true,
		sameSite: "strict",
		maxAge: 60 * 60 * 24 * 30,
		path: "/",
	});

	res.setHeader("Set-Cookie", serialized);
	res.status(200).json({ message: "Success." });
};

export default handler;
