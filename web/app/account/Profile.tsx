"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, UserSchema } from "../../types/User";
import { env } from "../../env/client.mjs";
import { useMutation } from "@tanstack/react-query";
import { tokenAtom } from "../ClientWrapper";
import { useAtom } from "jotai";

export const UpdateUserSchema = z.object({
	username: z.string().min(1, "Username cannot be empty."),
	email: z.string().min(1, "Email cannot be empty."),
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

const Profile = ({ user: { email, username } }: { user: User }) => {
	const router = useRouter();
	const [token] = useAtom(tokenAtom);

	const {
		register,
		handleSubmit,
		setError,
		formState: { isDirty },
		reset,
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

	const updateUser = (data: UpdateUser) => {
		update.mutate({ input: data, token });
	};

	return (
		<>
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
				<input
					type="submit"
					value="Update"
					className={`btn mt-2 ${
						isDirty
							? ""
							: "opacity-50 cursor-not-allowed !important hover:opacity-50 !important"
					}`}
				/>
			</form>
		</>
	);
};

export default Profile;
