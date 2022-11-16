"use client";

import { useEffect } from "react";

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
	useEffect(() => {
		// Log the error to an error reporting service
		// console.error(error.message);
	}, [error]);

	return (
		<main>
			<p className="text-xl mb-4 text-center">Something went wrong!</p>
			<button className="btn" onClick={() => reset()}>
				Reset
			</button>
		</main>
	);
};

export default Error;
