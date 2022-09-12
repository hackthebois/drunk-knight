import useAuth from "../hooks/useAuth";

const Account = () => {
	const { findUser, signout } = useAuth();
	const { data: user } = findUser;

	return (
		<div>
			<p>{user?.email}</p>
			<p>{user?.username}</p>
			<p>Email Confirmed: {user?.email_confirmation ? "True" : "False"}</p>
			<button className="gbtn" onClick={() => signout()}>
				Sign out
			</button>
		</div>
	);
};

export default Account;
