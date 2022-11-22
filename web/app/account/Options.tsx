"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDelete from "../../components/ConfirmDelete";

const signOut = async () => {
	await fetch("/api/auth/signout");
};

const deleteAccount = async () => {
	await fetch("/api/auth/delete");
};

const Options = () => {
	const router = useRouter();
	const [confirmDelete, setConfirmDelete] = useState(false);
	return (
		<>
			<button
				className="gbtn mr-3"
				onClick={() =>
					signOut().then(() => {
						router.refresh();
						router.push("/");
					})
				}
			>
				Sign Out
			</button>
			<button className="ebtn" onClick={() => setConfirmDelete(true)}>
				Delete Account
			</button>
			{confirmDelete ? (
				<ConfirmDelete
					onDelete={() =>
						deleteAccount().then(() => {
							router.refresh();
							router.push("/");
						})
					}
					onCancel={() => setConfirmDelete(false)}
					deletedItem="this account"
				/>
			) : null}
		</>
	);
};

export default Options;
