"use client";

import { useRouter } from "next/navigation";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { User } from "../../../types/User";
import { UserSchema } from "../../../types/User";
import { env } from "../../../env/client.mjs";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { FaSignOutAlt, FaTrash } from "react-icons/fa";
import ConfirmDelete from "../../../components/ConfirmDelete";
import { useState } from "react";
import { tokenAtom } from "../../ClientWrapper";

export const UpdateUserSchema = z.object({
	username: z.string().min(1, "Username cannot be empty.").optional(),
	email: z.string().min(1, "Email cannot be empty.").optional(),
});
export type UpdateUser = z.input<typeof UpdateUserSchema>;
const updateUserReq = async ({
	input,
	token,
}: {
	input: UpdateUser;
	token: string;
}) => {
	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/account`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(input),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.message);
	return UserSchema.parse(data);
};

const signOut = async () => {
	await fetch("/api/auth/signout", {
		cache: "no-store",
	});
};

const deleteAccount = async () => {
	await fetch("/api/auth/delete", {
		cache: "no-store",
	});
};

const Profile = ({ user: { email, username } }: { user: User }) => {
	const router = useRouter();
	const [token] = useAtom(tokenAtom);

	const {
		register,
		handleSubmit,
		setError,
		formState: { isDirty },
		reset,
		control,
	} = useForm<UpdateUser>({
		resolver: zodResolver(UpdateUserSchema),
		defaultValues: { email, username },
	});

	const update = useMutation(updateUserReq, {
		onError: (error: any) => {
			setError("username", { message: error.message });
		},
		onSuccess: ({ email, username }) => {
			reset({ email, username });
			router.refresh();
		},
	});

	const { dirtyFields } = useFormState({
		control,
	});

	const updateUser = (data: UpdateUser) => {
		const dirtyData = {
			email: dirtyFields.email ? data.email : undefined,
			username: dirtyFields.username ? data.username : undefined,
		};

		update.mutate({ input: dirtyData, token });
	};

	const [confirmDelete, setConfirmDelete] = useState(false);
	const [_, setToken] = useAtom(tokenAtom);

	return (
		<>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold">Profile</h2>
				<div>
					<button
						className="gbtn mr-3"
						onClick={() =>
							signOut().then(() => {
								setToken("");
								router.refresh();
								router.push("/play");
							})
						}
					>
						<FaSignOutAlt />
					</button>
					<button
						className="ebtn"
						onClick={() => setConfirmDelete(true)}
					>
						<FaTrash />
					</button>
				</div>
				{confirmDelete ? (
					<ConfirmDelete
						onDelete={() =>
							deleteAccount().then(() => {
								setToken("");
								router.refresh();
								router.push("/play");
							})
						}
						onCancel={() => setConfirmDelete(false)}
						deletedItem="this account"
					/>
				) : null}
			</div>
			<form className="form" onSubmit={handleSubmit(updateUser)}>
				<label htmlFor="username">Username</label>
				<input
					id="username"
					type="text"
					className="mb-4 mt-2"
					{...register("username")}
				/>
				<label htmlFor="email">Email</label>
				<input
					id="email"
					type="text"
					className="mb-4 mt-2"
					{...register("email")}
				/>
				<div className="flex">
					<input
						type="submit"
						value="Update"
						className={`btn mt-2 ${
							isDirty
								? ""
								: "opacity-50 cursor-not-allowed !important hover:opacity-50 !important"
						}`}
					/>
				</div>
			</form>
		</>
	);
};

export default Profile;
