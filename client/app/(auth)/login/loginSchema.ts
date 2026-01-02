import * as z from "zod";

export const loginSchema = z.object({
	username: z
		.string({ error: "Provide a valid username." })
		.regex(/^[a-z0-9.]+$/, { error: "Username must only contain lowercase letters, numbers and dot." })
		.min(1, { error: "Username is required." })
		.toLowerCase()
		.trim(),

	password: z
		.string({ error: "Provide a valid password." })
		.min(8, { error: "Password must be atleast 8 characters." })
		.trim(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
