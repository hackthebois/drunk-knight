import Link from "next/link";

const NotFound = () => {
	return (
		<div className="bg-background text-white">
			<main className="flex justify-center items-center flex-col w-full h-[85vh]">
				<div className="background flex flex-col justify-center items-center">
					<h2 className="text-3xl font-bold mb-3">Page not found</h2>
					<p className="my-3 mb-8">
						This page does not exist. Please navigate to a new page.
					</p>
					<div className="flex">
						<Link className="btn mr-4" href="/">
							Home
						</Link>
						<Link className="gbtn" href="/auth/signin">
							Sign in
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
};

export default NotFound;
