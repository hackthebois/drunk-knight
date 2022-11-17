"use client";

import { useRouter } from "next/navigation";
import { User } from "../../types/User";

const signOut = async () => {
	await fetch("/api/auth/signout").then(() => {
		localStorage.removeItem("accessToken");
	});
};

const Account = ({ user }: { user: User }) => {
	const router = useRouter();

	return (
		<main className="flex justify-center items-center flex-col w-full h-[85vh]">
			<div className="background w-full">
				<h2 className="text-2xl font-bold mb-4">Profile</h2>
				<p className="my-2">{user?.email}</p>
				<p className="my-2">{user?.username}</p>
				<p className="my-2">
					Email Confirmed:{" "}
					{user?.emailConfirmation ? "True" : "False"}
				</p>
				<button
					className="gbtn mt-3"
					onClick={() =>
						signOut().then(() => {
							router.refresh();
							router.push("/");
						})
					}
				>
					Sign out
				</button>
			</div>
		</main>
	);
};

export default Account;
