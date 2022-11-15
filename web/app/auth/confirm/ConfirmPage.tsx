"use client";

import Link from "next/link";
import { User } from "../../../types/User";

const resendEmail = () => {};

const Confirm = ({ user }: { user: User | null }) => {
	return (
		<main className="text-center flex flex-col items-center justify-center">
			{user && user.emailConfirmation ? (
				<>
					<h1 className="text-3xl font-bold">Email confirmed!</h1>
					<p className="text-lg mt-4">
						Thank you for verifying your email, you may now proceed
						to the game.
					</p>
					<Link href="/" className="gbtn mt-4">
						Home
					</Link>
				</>
			) : (
				<>
					<h1 className="text-3xl font-bold">
						Please confirm email!
					</h1>
					<p className="text-lg my-4">
						To finalize account, please click the link in the email
						sent to you.
					</p>
					<button className="gbtn" onClick={() => resendEmail()}>
						Resend email
					</button>
				</>
			)}
		</main>
	);
};

export default Confirm;