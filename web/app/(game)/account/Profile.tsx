"use client";

import { useRouter } from "next/navigation";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { User } from "../../../types/User";
import { UserSchema } from "../../../types/User";
import { env } from "../../../env/client.mjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import ConfirmDelete from "../../../components/ConfirmDelete";
import { useState } from "react";
import { tokenAtom } from "../../ClientWrapper";
import toast from "react-hot-toast";

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
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		setError,
		formState: { isDirty, errors },
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
			toast.success("Updated account");
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
				<button
					className="gbtn"
					onClick={() =>
						signOut().then(() => {
							setToken("");
							router.refresh();
							queryClient.resetQueries();
							router.push("/play");
						})
					}
				>
					Sign out
				</button>
			</div>
			<form className="form" onSubmit={handleSubmit(updateUser)}>
				{errors.username ? (
					<p className="ebtn mb-4">{errors.username.message}</p>
				) : errors.email ? (
					<p className="ebtn mb-4">{errors.email.message}</p>
				) : null}
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

			<h2 className="text-2xl font-bold mt-6 mb-2">Delete Account</h2>
			<p className="mb-4 opacity-80">
				Deleting your account will remove all content associated with
				it.
			</p>
			<button
				className="ebtn flex justify-center items-center"
				onClick={() => setConfirmDelete(true)}
			>
				I want to delete my account
			</button>
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
		</>
	);
};

export default Profile;
