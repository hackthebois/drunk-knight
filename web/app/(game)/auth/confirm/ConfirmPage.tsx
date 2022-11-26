"use client";

import { env } from "../../../../env/client.mjs";

const resendEmail = async (email: string) => {
	await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/auth/resend-email`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email }),
	});
};

const Confirm = ({ email }: { email?: string }) => {
	return (
		<main className="flex justify-center items-center flex-col w-full h-[85vh]">
			<div className="background flex justify-center items-center flex-col">
				<h1 className="text-3xl font-bold">Please confirm email!</h1>
				<p className="text-lg my-4 text-center">
					To finalize account, please click the link in the email sent
					to you.
				</p>
				{email ? (
					<button className="gbtn" onClick={() => resendEmail(email)}>
						Resend email
					</button>
				) : null}
			</div>
		</main>
	);
};

export default Confirm;
