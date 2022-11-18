import Confirm from "./ConfirmPage";

type Props = {
	searchParams?: {
		email?: string;
	};
};

const Page = async ({ searchParams }: Props) => {
	return <Confirm email={searchParams?.email} />;
};

export default Page;
