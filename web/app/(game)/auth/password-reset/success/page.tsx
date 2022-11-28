import Link from "next/link";

const Page = () => {
	return (
		<main className="flex justify-center items-center flex-col w-full h-[85vh]">
			<div className="background flex justify-center items-center flex-col">
				<h1 className="text-3xl font-bold">Password Changed!</h1>
				<p className="text-lg my-4 text-center">
					You may now login and play.
				</p>
				<div className="flex">
					<Link href={"/auth/signin"} className="btn mr-3">
						Sign In
					</Link>
				</div>
			</div>
		</main>
	);
};

export default Page;
