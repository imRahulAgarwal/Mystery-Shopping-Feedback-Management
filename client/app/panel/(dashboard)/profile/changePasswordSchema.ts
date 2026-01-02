import * as z from "zod";

export const changePasswordSchema = z.object({
	currentPassword: z
		.string({ error: "Current password is required." })
		.min(8, { error: "Current Password must be atleast 8 characters." })
		.trim(),
	newPassword: z
		.string({ error: "New password is required." })
		.min(8, { error: "New Password must be atleast 8 characters." })
		.trim(),
	confirmPassword: z
		.string({ error: "Confirm password is required." })
		.min(8, { error: "Confirm Password must be atleast 8 characters." })
		.trim(),
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
