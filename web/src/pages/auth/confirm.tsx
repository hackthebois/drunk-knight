import Link from "next/link";
import useAuth from "../../hooks/useAuth";
const Confirm = () => {
	const { findUser } = useAuth();
	const { data: user } = findUser;
	return (
		<main className="text-center flex flex-col items-center justify-center">
			{user && user.email_confirmation ? (
				<>
					<h1 className="text-3xl font-bold">Email confirmed!</h1>
					<p className="text-lg mt-4">
						Thank you for verifying your email, you may now proceed to the game.
					</p>
					<Link href="/">
						<a className="gbtn mt-4">Home</a>
					</Link>
				</>
			) : (
				<>
					<h1 className="text-3xl font-bold">Please confirm email!</h1>
					<p className="text-lg mt-4">
						To finalize account, please click the link in the email sent to you.
					</p>
				</>
			)}
		</main>
	);
};

export default Confirm;
