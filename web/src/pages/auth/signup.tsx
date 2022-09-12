import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const SignUpInputSchema = z.object({
	email: z.string().email(),
	username: z.string().min(4, "Username must contain at least 4 character(s)"),
	password: z.string().min(8, "Password must contain at least 8 character(s)"),
});
export type SignUpInput = z.input<typeof SignUpInputSchema>;
const signUpReq = async (input: SignUpInput) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/signup`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(input),
	});
	const data: any = await res.json();
	if (!res.ok) throw new Error((data && data.message) || res.status);
	return z.object({ token: z.string() }).parse(data);
};

const SignUp = () => {
	const queryClient = useQueryClient();
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
		onSuccess: ({ token }) => {
			localStorage.setItem("access_token", token);
			queryClient.invalidateQueries(["user"]);
			router.push("/auth/confirm");
		},
		onError: (error: any) => {
			if (error && error.message) setError("username", { message: error.message });
		},
	});

	const onSubmit = (data: SignUpInput) => {
		signup.mutate(data);
	};

	return (
		<main className="flex justify-center items-center flex-col w-full h-full">
			<form onSubmit={handleSubmit(onSubmit)} className="form">
				<h2 className="text-white font-bold text-3xl mb-8 text-center">Sign up</h2>
				{errors.username ? (
					<p className="ebtn mb-4">{errors.username.message}</p>
				) : errors.email ? (
					<p className="ebtn mb-4">{errors.email.message}</p>
				) : (
					errors.password && <p className="ebtn mb-4">{errors.password.message}</p>
				)}
				<label htmlFor="username" className="text-white text-xl">
					Username
				</label>
				<input
					id="username"
					className="input"
					{...register("username")}
					placeholder="Username here..."
				/>
				<label htmlFor="email" className="text-white text-xl">
					Email
				</label>
				<input
					id="email"
					className="input"
					{...register("email")}
					placeholder="Email here..."
				/>
				<label htmlFor="password" className="text-white text-xl">
					Password
				</label>
				<input
					id="password"
					type="password"
					className="input"
					{...register("password")}
					placeholder="Password here..."
				/>
				<input type="submit" value="Submit" className="gbtn mt-4" />
				<div className="flex justify-center items-center mt-8">
					<p className="text-white">{`Already have an account?`}</p>
					<Link href="/auth/signin">
						<a className=" text-blue-400 underline ml-2">Sign in</a>
					</Link>
				</div>
			</form>
		</main>
	);
};

export default SignUp;
