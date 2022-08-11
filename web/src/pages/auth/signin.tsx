import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import useAuth, { SignInInput, SignInInputSchema } from "../../hooks/useAuth";

const SignIn = () => {
	const { signin } = useAuth();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInInput>({
		resolver: zodResolver(SignInInputSchema),
	});

	const onSubmit = (data: SignInInput) => {
		signin.mutate(data);
	};

	return (
		<main className="flex justify-center items-center flex-col w-full h-full">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className=" border-[1px] border-[#ccc] rounded max-w-[400px] p-10"
			>
				<h2 className="text-white font-bold text-3xl mb-8 text-center">Sign in</h2>
				{errors.username ? (
					<p className="ebtn mb-4">{errors.username.message}</p>
				) : (
					errors.password && <p className="ebtn mb-4">{errors.password.message}</p>
				)}
				<label htmlFor="email" className="text-white text-xl">
					Username
				</label>
				<input className="input" {...register("username")} placeholder="Username here..." />
				<label htmlFor="email" className="text-white text-xl">
					Password
				</label>
				<input
					type="password"
					className="input"
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
