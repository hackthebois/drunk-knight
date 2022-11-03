import DeckPage from "./DeckPage";

type Props = {
	params: {
		id: string;
	};
};

const Page = async ({ params: { id } }: Props) => <DeckPage id={id} />;

export default Page;
