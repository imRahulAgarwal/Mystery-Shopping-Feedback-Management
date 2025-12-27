export const generateSlug = (word: unknown) => {
	if (!word || typeof word !== "string") return "";

	return String(word)
		.trim()
		.toLowerCase()
		.replace(/[^a-zA-Z0-9]/g, "-");
};
