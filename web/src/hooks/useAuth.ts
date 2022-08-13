import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

// TYPES //
export const UserSchema = z.object({
	id: z.string().cuid(),
	email: z.string().email(),
	username: z.string(),
});
export type User = z.input<typeof UserSchema>;

export const SignInInputSchema = z.object({
	username: z.string().min(1),
	password: z.string().min(1),
});
export type SignInInput = z.input<typeof SignInInputSchema>;

export const SignUpInputSchema = z.object({
	email: z.string().email(),
	username: z.string().min(4, "Username must contain at least 4 character(s)"),
	password: z.string().min(8, "Password must contain at least 8 character(s)"),
});
export type SignUpInput = z.input<typeof SignUpInputSchema>;

export const UpdateUserSchema = z.object({
	email: z.string().email(),
	username: z.string().min(4, "Username must contain at least 4 character(s)"),
});
export type UpdateUser = z.input<typeof UpdateUserSchema>;

// REQUESTS //
const signInReq = async (input: SignInInput) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/signin`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(input),
	});
	const data: unknown = await res.text();
	return z.string().parse(data);
};

const signUpReq = async (input: SignUpInput) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/signup`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(input),
	});
	const data: unknown = res.text();
	return z.string().parse(data);
};

const getUserReq = async () => {
	const accessToken = localStorage.getItem("access_token");

	const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/account`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const data: unknown = await res.json();
	return UserSchema.parse(data);
};

const updateUserReq = async ({
	username,
	email,
}: {
	username: User["username"];
	email: User["email"];
}) => {
	const accessToken = localStorage.getItem("access_token");

	const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/account`, {
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

// HOOK //
const useAuth = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	const getUser = useQuery(["user"], getUserReq, { refetchOnWindowFocus: false });

	const updateUser = useMutation(updateUserReq, {
		onSuccess: () => queryClient.invalidateQueries(["user"]),
	});

	const signin = useMutation(signInReq, {
		onSuccess: (data) => {
			localStorage.setItem("access_token", data);
			queryClient.invalidateQueries(["user"]);
			router.push("/");
		},
	});

	const signup = useMutation(signUpReq, {
		onSuccess: (data) => {
			localStorage.setItem("access_token", data);
			queryClient.invalidateQueries(["user"]);
			router.push("/");
		},
	});

	const signout = () => {
		localStorage.setItem("access_token", "");
		queryClient.resetQueries(["user"]);
	};

	return { getUser, signin, signup, signout, updateUser };
};

export default useAuth;
