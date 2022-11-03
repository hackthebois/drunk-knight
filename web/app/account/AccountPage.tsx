"use client";

import { useSignOut, useUser } from "../../hooks/user";

const Account = () => {
	const signOut = useSignOut();

	const { data: user } = useUser();

	return (
		<main>
			<div className="background w-full">
				<h2 className="text-2xl font-bold mb-4">Profile</h2>
				<p className="my-2">{user?.email}</p>
				<p className="my-2">{user?.username}</p>
				<p className="my-2">
					Email Confirmed:{" "}
					{user?.emailConfirmation ? "True" : "False"}
				</p>
				<button className="gbtn mt-3" onClick={() => signOut()}>
					Sign out
				</button>
			</div>
		</main>
	);
};

export default Account;
