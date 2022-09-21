import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const SignInInputSchema = z.object({
	username: z.string().min(1, "Username cannot be empty."),
	password: z.string().min(1, "Password cannot be empty."),
});
export type SignInInput = z.input<typeof SignInInputSchema>;
const signInReq = async (input: SignInInput) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/signin`, {
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

const SignIn = () => {
	const queryClient = useQueryClient();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<SignInInput>({
		resolver: zodResolver(SignInInputSchema),
	});

	const signin = useMutation(signInReq, {
		onSuccess: ({ token }) => {
			localStorage.setItem("access_token", token);
			queryClient.invalidateQueries(["user"]);
			router.push("/");
		},
		onError: (error: any) => {
			if (error && error.message === "Please Confirm Email Before Attemping to Log In")
				router.push("/auth/confirm");
			else if (error && error.message) setError("username", { message: error.message });
		},
	});

	const onSubmit = (data: SignInInput) => {
		signin.mutate(data);
	};

	return (
		<main className="flex justify-center items-center flex-col w-full h-full">
			<form onSubmit={handleSubmit(onSubmit)} className="form">
				<h2 className="text-white font-bold text-3xl mb-8 text-center">Sign in</h2>
				{errors.username ? (
					<p className="ebtn mb-4">{errors.username.message}</p>
				) : (
					errors.password && <p className="ebtn mb-4">{errors.password.message}</p>
				)}
				<label htmlFor="username" className="text-white text-xl">
					Username
				</label>
				<input
					id="username"
					className="input mb-4 mt-2"
					{...register("username")}
					placeholder="Username here..."
				/>
				<label htmlFor="password" className="text-white text-xl">
					Password
				</label>
				<input
					id="password"
					type="password"
					className="input mb-4 mt-2"
					{...register("password")}
					placeholder="Password here..."
				/>
				<input type="submit" value="Submit" className="gbtn mt-4" />
				<div className="flex justify-center items-center mt-8">
					<p className="text-white">{`Don't have an account?`}</p>
					<Link href="/auth/signup">
						<a className=" text-blue-400 underline ml-2">Sign up</a>
					</Link>
				</div>
			</form>
		</main>
	);
};

export default SignIn;
