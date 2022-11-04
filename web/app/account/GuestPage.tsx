"use client";

import { useRouter } from "next/navigation";

const GuestPage = () => {
	const router = useRouter();
	return (
		<main>
			<div className="background w-full">
				<h2 className="text-2xl font-bold mb-3">Logged in as guest.</h2>
				<p className="my-3 mb-8">
					Log in to access profile features like custom decks.
				</p>
				<button
					className="gbtn mr-4"
					onClick={() => router.push("/auth/signin")}
				>
					Sign in
				</button>
				<button
					className="gbtn"
					onClick={() => router.push("/auth/signup")}
				>
					Sign up
				</button>
			</div>
		</main>
	);
};

export default GuestPage;
