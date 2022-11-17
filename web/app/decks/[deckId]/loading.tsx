import Loader from "../../../components/Loader";

const Loading = () => {
	return (
		<main className="flex flex-col justify-between">
			<div className="background flex flex-col flex-1 overflow-auto w-full">
				<Loader visible />
			</div>
		</main>
	);
};

export default Loading;
