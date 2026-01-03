import * as z from "zod";

export const industrySchema = z.object({
	name: z
		.string({ error: "Industry name is required." })
		.trim()
		.regex(/^[A-Z0-9a-z ]+/, { error: "Industry name is required." }),
});

export type IndustryData = z.infer<typeof industrySchema>;
