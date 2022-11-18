"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const SignUpInputSchema = z.object({
	email: z.string().email(),
	username: z
		.string()
		.min(4, "Username must contain at least 4 character(s)"),
	password: z
		.string()
		.min(8, "Password must contain at least 8 character(s)"),
});
export type SignUpInput = z.input<typeof SignUpInputSchema>;
const signUpReq = async (input: SignUpInput) => {
	await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/signup`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(input),
	});
	return input;
};

const SignUp = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<SignUpInput>({
		resolver: zodResolver(SignUpInputSchema),
	});
	const router = useRouter();

	const signup = useMutation(signUpReq, {
		onSuccess: (data) => {
			router.push(`/auth/confirm?email=${data.email}`);
		},
		onError: (error: any) => {
			if (error && error.message)
				setError("username", { message: error.message });
		},
	});

	const onSubmit = (data: SignUpInput) => {
		signup.mutate(data);
	};

	return (
		<main className="flex justify-center items-center flex-col w-full h-[85vh]">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="form w-full max-w-md background"
			>
				<h2 className="text-white font-bold text-3xl mb-8 text-center">
					Sign Up
				</h2>
				{errors.username ? (
					<p className="ebtn mb-4">{errors.username.message}</p>
				) : errors.email ? (
					<p className="ebtn mb-4">{errors.email.message}</p>
				) : (
					errors.password && (
						<p className="ebtn mb-4">{errors.password.message}</p>
					)
				)}
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
				<label htmlFor="password">Password</label>
				<input
					id="password"
					type="password"
					className="mb-4 mt-2"
					{...register("password")}
				/>
				<input type="submit" value="Submit" className="mt-4" />
				<div className="flex justify-center items-center mt-8">
					<p className="text-white">{`Already have an account?`}</p>
					<Link
						href="/auth/signin"
						className="text-blue-400 underline ml-2"
					>
						Sign in
					</Link>
				</div>
			</form>
		</main>
	);
};

export default SignUp;
