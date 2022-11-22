"use client";

import { useRouter } from "next/navigation";

const signOut = async () => {
	await fetch("/api/auth/signout");
};

const deleteAccount = async () => {
	await fetch("/api/auth/delete");
};

const Options = () => {
	const router = useRouter();
	return (
		<>
			<button
				className="gbtn mr-3"
				onClick={() =>
					signOut().then(() => {
						router.refresh();
						router.push("/");
					})
				}
			>
				Sign Out
			</button>
			<button
				className="ebtn"
				onClick={() =>
					deleteAccount().then(() => {
						router.refresh();
						router.push("/");
					})
				}
			>
				Delete Account
			</button>
		</>
	);
};

export default Options;
