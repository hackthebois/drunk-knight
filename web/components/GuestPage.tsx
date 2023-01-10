import Link from "next/link";

type Props = {
	signInTo: string;
};

const GuestPage = ({ signInTo }: Props) => {
	return (
		<main className="flex justify-center items-center flex-col w-full h-[85vh]">
			<div className="background flex flex-col justify-center items-center">
				<h2 className="text-2xl font-bold mb-3 text-center">
					Sign in to {signInTo}
				</h2>
				<p className="my-3 mb-8 text-center">
					Access profile features like custom decks, community decks,
					and more.
				</p>
				<div className="flex">
					<Link className="btn mr-4" href="/auth/signin">
						Sign in
					</Link>
					<Link className="gbtn" href="/auth/signup">
						Sign up
					</Link>
				</div>
			</div>
		</main>
	);
};

export default GuestPage;
