import { NextPage } from "next";
import { useRouter } from "next/router";
import { FaAngleLeft } from "react-icons/fa";

const Info: NextPage = () => {
	const router = useRouter();

	return (
		<div className="bg-background w-[100vw] h-[100vh] overflow-hidden">
			<div
				className="absolute top-4 left-4 w-10 h-10 flex justify-center items-center"
				onClick={() => router.push("/")}
			>
				<FaAngleLeft fill="#ffffff" className="w-8 h-8" />
			</div>
			<h2 className="text-white text-3xl text-center my-5 font-bold">Instructions</h2>
		</div>
	);
};

export default Info;
