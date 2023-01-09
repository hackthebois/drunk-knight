import Link from "next/link";

const Page = () => {
	return (
		<main className="flex justify-center items-center flex-col w-full h-[85vh]">
			<div className="background w-full">
				<h2 className="text-2xl font-bold mb-3">
					Sign in to access your account
				</h2>
				<p className="my-3 mb-8">
					Access profile features like custom decks, community decks,
					and more.
				</p>
				<Link className="btn mr-4" href="/auth/signin">
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
