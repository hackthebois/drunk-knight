import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaChevronCircleLeft } from "react-icons/fa";
import useAuth, { UpdateUser, UpdateUserSchema, User } from "../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

const Profile = () => {
	const {
		handleSubmit,
		register,
		setValue,
		formState: { errors },
	} = useForm<UpdateUser>({
		resolver: zodResolver(UpdateUserSchema),
	});
	const router = useRouter();
	const { getUser, updateUser } = useAuth();
	const { data: user } = getUser;

	useEffect(() => {
		if (user) {
			setValue("username", user.username);
			setValue("email", user.email);
		}
	}, [user, setValue]);

	const onSubmit = (data: UpdateUser) => {
		updateUser.mutate(data, { onSuccess: () => router.push("/") });
	};

	return (
		<main className="flex justify-center items-center flex-col w-full h-full">
			<Link href="/">
				<a className="absolute top-4 left-4 text-white">
					<FaChevronCircleLeft size={26} />
				</a>
			</Link>
			<form onSubmit={handleSubmit(onSubmit)} className="form">
				<h2 className="text-white font-bold text-3xl mb-8 text-center">Profile</h2>
				{errors.username ? (
					<p className="ebtn mb-4">{errors.username.message}</p>
				) : (
					errors.email && <p className="ebtn mb-4">{errors.email.message}</p>
				)}
				<label htmlFor="username" id="username" className="text-white text-xl">
					Username
				</label>
				<input
					id="username"
					defaultValue={user?.username}
					className="input"
					{...register("username")}
					placeholder="Username here..."
				/>
				<label htmlFor="email" className="text-white text-xl">
					Email
				</label>
				<input
					id="email"
					defaultValue={user?.email}
					className="input"
					{...register("email")}
					placeholder="Email here..."
				/>
				<input type="submit" value="Update" className="gbtn mt-4" />
			</form>
		</main>
	);
};

export default Profile;
