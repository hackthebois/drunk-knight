"use client";

import { useEffect } from "react";

export default function Error({ error }: { error: Error }) {
	useEffect(() => {
		// Log the error to an error reporting service
		// console.error(error.message);
	}, [error]);

	return (
		<main>
			<h2 className="text-xl mb-4 text-center">{error.message}</h2>
		</main>
	);
}
