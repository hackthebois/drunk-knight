import Loader from "../../../components/Loader";

const Loading = () => {
	return (
		<main className="flex justify-center items-center flex-col w-full h-[90vh]">
			<Loader visible />
		</main>
	);
};

export default Loading;
