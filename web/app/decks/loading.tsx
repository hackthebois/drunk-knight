import Loader from "../../components/Loader";

const Loading = () => {
	return (
		<main>
			<div className="background flex-1 flex flex-col overflow-auto w-full">
				<h2 className="text-2xl font-bold">Decks</h2>
				<Loader visible />
			</div>
		</main>
	);
};

export default Loading;
