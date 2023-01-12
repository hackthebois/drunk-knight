import Link from "next/link";
import Confirm from "./ConfirmPage";

type Props = {
	searchParams?: {
		email?: string;
		error?: string;
	};
};

const Page = async ({ searchParams }: Props) => {
	if (searchParams?.error === "jwt") {
		return (
			<main className="flex justify-center items-center flex-col w-full h-[85vh]">
				<div className="background flex justify-center items-center flex-col">
					<h1 className="text-2xl sm:text-3xl font-bold text-center">
						Error with confirmation!
					</h1>
					<p className="text-lg mt-4 text-center">
						Please retry confirming.
					</p>
					<Link href="/auth/resend-email" className="btn mt-6">
						Resend Email
					</Link>
				</div>
			</main>
		);
	}

	return <Confirm email={searchParams?.email} />;
};

export default Page;
