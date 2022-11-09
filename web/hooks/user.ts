import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { env } from "../env/client.mjs";
import { UpdateUser, UserSchema } from "../types/User";

// UPDATE USER (PUT /account)
const updateUserReq = async ({ username, email }: UpdateUser) => {
	const accessToken = localStorage.getItem("accessToken");

	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/account`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			username,
			email,
		}),
	});
	const data: unknown = await res.json();
	return UserSchema.parse(data);
};
export const useUpdateUser = () => {
	const queryClient = useQueryClient();
	return useMutation(updateUserReq, {
		onSuccess: () => queryClient.invalidateQueries(["user"]),
	});
};

// SIGN OUT
export const useSignOut = () => {
	const queryClient = useQueryClient();
	const router = useRouter();
	const signOut = () => {
		localStorage.setItem("accessToken", "");
		queryClient.clear();
		router.push("/");
	};
	return signOut;
};
