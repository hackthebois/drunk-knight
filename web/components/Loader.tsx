"use client";

import { ThreeDots } from "react-loader-spinner";

type Props = {
	visible: boolean;
};

const Loader = ({ visible }: Props) => {
	return (
		<div className="text-center w-full flex justify-center">
			<ThreeDots
				height="50"
				width="50"
				radius="9"
				color="#AE76A6"
				ariaLabel="three-dots-loading"
				visible={visible}
			/>
		</div>
	);
};

export default Loader;
