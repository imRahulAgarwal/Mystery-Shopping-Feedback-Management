"use client";

import { useForm } from "react-hook-form";
import { ChangePasswordFormData, changePasswordSchema } from "./changePasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Lock } from "lucide-react";
import { SubmitButton } from "@/components/panel/Buttons/Buttons";
import Loader from "@/lib/ui/Loader/Loader";

export default function ProfilePage() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ChangePasswordFormData>({
		resolver: zodResolver(changePasswordSchema),
		mode: "onSubmit",
	});

	const [showPassword, setShowPassword] = useState(false);

	const onFormSubmit = async (data: ChangePasswordFormData) => {
		await new Promise((r) => setTimeout(r, 2000));
		console.log(data);
	};

	return (
		<div className="grid gap-6 md:grid-cols-3">
			{/* Profile Info */}
			<div className="md:col-span-1 rounded-xs border border-border bg-background p-5">
				<h2 className="text-sm font-semibold border-b border-slate-200 pb-2">Profile</h2>

				<div className="mt-4 space-y-1 text-sm">
					<p className="font-medium">Rahul Agarwal</p>
					<p className="text-muted-foreground">imagarwal05@gmail.com</p>
				</div>
			</div>

			{/* Change Password */}
			<div className="md:col-span-2 rounded-xs border border-border bg-background p-5">
				<h2 className="text-sm font-semibold border-b border-slate-200 pb-2">Change password</h2>

				<form onSubmit={handleSubmit(onFormSubmit)} className="mt-4 space-y-4" noValidate>
					{/* Current password */}
					<div className="space-y-1">
						<label htmlFor="currentPassword" className="text-xs font-medium">
							Current password <span className="text-danger">*</span>
						</label>

						<div className="relative">
							<input
								id="currentPassword"
								type={showPassword ? "text" : "password"}
								aria-invalid={!!errors.currentPassword}
								{...register("currentPassword")}
								disabled={isSubmitting}
								className="input"
							/>
							<Lock
								size={14}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
							/>
						</div>

						{errors.currentPassword && (
							<p className="text-xs text-danger">{errors.currentPassword.message}</p>
						)}
					</div>

					{/* New password */}
					<div className="space-y-1">
						<label htmlFor="newPassword" className="text-xs font-medium">
							New password <span className="text-danger">*</span>
						</label>

						<div className="relative">
							<input
								id="newPassword"
								type={showPassword ? "text" : "password"}
								aria-invalid={!!errors.newPassword}
								{...register("newPassword")}
								disabled={isSubmitting}
								className="input"
							/>
							<Lock
								size={14}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
							/>
						</div>

						{errors.newPassword && <p className="text-xs text-danger">{errors.newPassword.message}</p>}
					</div>

					{/* Confirm password */}
					<div className="space-y-1">
						<label htmlFor="confirmPassword" className="text-xs font-medium">
							Confirm password <span className="text-danger">*</span>
						</label>

						<div className="relative">
							<input
								id="confirmPassword"
								type={showPassword ? "text" : "password"}
								aria-invalid={!!errors.confirmPassword}
								{...register("confirmPassword")}
								disabled={isSubmitting}
								className="input"
							/>
							<Lock
								size={14}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
							/>
						</div>

						{errors.confirmPassword && (
							<p className="text-xs text-danger">{errors.confirmPassword.message}</p>
						)}
					</div>

					{/* Options */}
					<label className="flex items-center gap-2 text-xs">
						<input
							type="checkbox"
							checked={showPassword}
							onChange={() => setShowPassword((p) => !p)}
							className="rounded-[3px] border-border"
						/>
						Show passwords
					</label>

					{/* Submit */}
					<div className="flex items-center justify-center">
						<SubmitButton
							onButtonClick={() => {}}
							disabled={isSubmitting}
							buttonLabel={isSubmitting ? <Loader size={16} /> : "Change Password"}
						/>
					</div>
				</form>
			</div>
		</div>
	);
}
