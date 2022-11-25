"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const ResetPasswordSchema = z.object({
	password: z
		.string()
		.min(8, "Password must contain at least 8 character(s)"),
	repeatPassword: z.string(),
});
export type ResetPassword = z.input<typeof ResetPasswordSchema>;
const resetPasswordReq = async ({
	input: { password },
	token,
}: {
	input: ResetPassword;
	token: string;
}) => {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/password-reset/${token}`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ password }),
		},
	);
	const data = await res.json();
	if (!res.ok) throw new Error(data.message);
};

const PasswordReset = ({ token }: { token: string }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<ResetPassword>({
		resolver: zodResolver(ResetPasswordSchema),
	});
	const router = useRouter();

	const resetPassword = useMutation(resetPasswordReq, {
		onSuccess: () => {
			router.push("/auth/reset-password/success");
		},
		onError: (error: any) => {
			if (error && error.message)
				setError("password", { message: error.message });
		},
	});

	const onSubmit = (data: ResetPassword) => {
		if (data.password === data.repeatPassword) {
			resetPassword.mutate({ input: data, token });
		} else {
			setError("password", { message: "Passwords do not match." });
		}
	};

	return (
		<main className="flex justify-center items-center flex-col w-full h-[85vh]">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="form w-full max-w-md background"
			>
				<h2 className="text-white font-bold text-3xl mb-8 text-center">
					New Password
				</h2>
				{errors.password ? (
					<p className="ebtn mb-4">{errors.password.message}</p>
				) : null}
				<label htmlFor="password">Password</label>
				<input
					id="password"
					type="password"
					className="mb-4 mt-2"
					{...register("password")}
				/>
				<label htmlFor="repeatPassword">Repeat Password</label>
				<input
					id="repeatPassword"
					type="password"
					className="mb-4 mt-2"
					{...register("repeatPassword")}
				/>
				<input type="submit" value="Submit" className="btn mt-4" />
			</form>
		</main>
	);
};

export default PasswordReset;
