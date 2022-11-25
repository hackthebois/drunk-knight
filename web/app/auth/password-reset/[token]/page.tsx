import PasswordReset from "./PasswordReset";

const Page = async ({ params: { token } }: { params: { token: string } }) => {
	return <PasswordReset token={token} />;
};

export default Page;
