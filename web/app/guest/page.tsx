import Link from "next/link";

const Page = () => {
	return (
		<main>
			<div className="background w-full">
				<h2 className="text-2xl font-bold mb-3">Playing as guest.</h2>
				<p className="my-3 mb-8">
					Log in to access profile features like custom decks.
				</p>
				<Link className="gbtn mr-4" href="/auth/signin">
					Sign in
				</Link>
				<Link className="gbtn" href="/auth/signup">
					Sign up
				</Link>
			</div>
		</main>
	);
};

export default Page;
