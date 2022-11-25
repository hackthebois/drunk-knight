"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDelete from "../../components/ConfirmDelete";
import { tokenAtom } from "../ClientWrapper";

const signOut = async () => {
	await fetch("/api/auth/signout");
};

const deleteAccount = async () => {
	await fetch("/api/auth/delete");
};

const Options = () => {
	const router = useRouter();
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [_, setToken] = useAtom(tokenAtom);

	return (
		<>
			<button
				className="gbtn mr-3"
				onClick={() =>
					signOut().then(() => {
						setToken("");
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
							setToken("");
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
