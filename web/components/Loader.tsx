"use client";

import { Oval } from "react-loader-spinner";

type Props = {
	visible: boolean;
	color?: string;
	size?: number;
};

const Loader = ({ visible, color = "#AE76A6", size = 40 }: Props) => {
	return (
		<div className="text-center w-full flex justify-center flex-1 items-center">
			<Oval
				height={size}
				width={size}
				color={color}
				secondaryColor="#CCCCCC"
				ariaLabel="three-dots-loading"
				visible={visible}
			/>
		</div>
	);
};

export default Loader;
