import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { serialize } from "cookie";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { useStandard } = z
		.object({ useStandard: z.boolean() })
		.parse(JSON.parse(req.body));

	const serialized = serialize("useStandard", `${useStandard}`, {
		httpOnly: true,
		sameSite: "strict",
		maxAge: 60 * 60 * 24 * 30,
		path: "/",
	});

	res.setHeader("Set-Cookie", serialized);
	res.status(200).json({ message: "Success." });
};

export default handler;
