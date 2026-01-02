"use client";

import { Lock, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "./loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";

export default function LoginPage() {
	const {
		register,
		formState: { errors, isSubmitting },
		handleSubmit,
	} = useForm<LoginFormData>({ mode: "onSubmit", resolver: zodResolver(loginSchema) });

	const [showPassword, setShowPassword] = useState(false);

	const onFormSubmit = async (data: LoginFormData) => {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		console.log(data);
	};

	return (
		<section
			aria-labelledby="login-title"
			className="w-full max-w-sm rounded-xs border border-slate-200 bg-background shadow-sm">
			<div className="p-4 space-y-6">
				{/* Header */}
				<header className="text-center">
					<h1 id="login-title" className="text-xl font-semibold">
						Insight Hub
					</h1>
					<p className="text-sm text-muted-foreground">Sign in to continue</p>
				</header>

				{/* Form */}
				<form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" noValidate>
					{/* Username */}
					<div className="space-y-1">
						<label htmlFor="username" className="text-sm font-medium">
							Username <span className="text-danger">*</span>
						</label>

						<div className="group relative">
							<input
								id="username"
								type="text"
								aria-invalid={!!errors.username}
								{...register("username")}
								disabled={isSubmitting}
								className="input"
							/>
							<User
								size={16}
								className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
							/>
						</div>

						{errors.username && <p className="text-xs text-danger">{errors.username.message}</p>}
					</div>

					{/* Password */}
					<div className="space-y-1">
						<label htmlFor="password" className="text-sm font-medium">
							Password <span className="text-danger">*</span>
						</label>

						<div className="group relative">
							<input
								id="password"
								type={showPassword ? "text" : "password"}
								aria-invalid={!!errors.password}
								{...register("password")}
								disabled={isSubmitting}
								className="input"
							/>
							<Lock
								size={16}
								className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
							/>
						</div>

						{errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
					</div>

					{/* Secondary actions */}
					<div className="flex items-center justify-between text-xs">
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								checked={showPassword}
								onChange={() => setShowPassword((p) => !p)}
								className="rounded-xs border-border"
							/>
							Show password
						</label>

						{/* <Link href="/panel/forgot-password" className="underline underline-offset-2">
								Forgot password?
							</Link> */}
					</div>

					{/* Submit */}
					<button
						type="submit"
						disabled={isSubmitting}
						className="btn bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80">
						{isSubmitting ? "Signing in…" : "Sign in"}
					</button>
				</form>
			</div>
		</section>
	);
}
