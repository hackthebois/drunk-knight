"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const ResetPasswordEmailSchema = z.object({
	email: z.string().email(),
});
export type ResetPasswordEmail = z.input<typeof ResetPasswordEmailSchema>;
const resetPasswordEmail = async (input: ResetPasswordEmail) => {
	await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/resend-email`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(input),
	});
};

const PasswordResetEmail = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<ResetPasswordEmail>({
		resolver: zodResolver(ResetPasswordEmailSchema),
	});

	const resetByEmail = useMutation(resetPasswordEmail, {
		onError: (error: any) => {
			if (error && error.message)
				setError("email", { message: error.message });
		},
	});

	const onSubmit = (data: ResetPasswordEmail) => {
		resetByEmail.mutate(data);
	};

	return (
		<main className="flex justify-center items-center flex-col w-full h-[85vh]">
			{resetByEmail.isSuccess ? (
				<div className="background flex justify-center items-center flex-col">
					<h1 className="text-3xl font-bold">Check your email!</h1>
					<p className="text-lg mt-4 text-center">
						Please check your email for a reset link.
					</p>
				</div>
			) : (
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="form w-full max-w-md background"
				>
					<h2 className="text-white font-bold text-2xl sm:text-3xl mb-8 text-center">
						Resend Confirmation
					</h2>
					{errors.email ? (
						<p className="ebtn mb-4">{errors.email.message}</p>
					) : null}
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="text"
						className="mb-8 mt-2"
						{...register("email")}
					/>
					<div className="flex">
						<input
							type="submit"
							value="Submit"
							className="btn mr-2 flex-1"
						/>
						<div
							className="gbtn text-center flex-1"
							onClick={() => router.back()}
						>
							Cancel
						</div>
					</div>
				</form>
			)}
		</main>
	);
};

export default PasswordResetEmail;
