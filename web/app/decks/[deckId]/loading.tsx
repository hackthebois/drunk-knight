import Loader from "../../../components/Loader";

const Loading = () => {
	return (
		<main>
			<div className="flex-1 flex flex-col overflow-auto w-full">
				<Loader visible />
			</div>
		</main>
	);
};

export default Loading;
