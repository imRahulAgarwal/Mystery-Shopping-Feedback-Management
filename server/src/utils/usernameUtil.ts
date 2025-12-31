import User from "../models/user.js";

/**
 * Normalize name parts and build base username
 */
function buildBaseUsername(firstName: string, lastName: string): string {
	return `${firstName}.${lastName}`
		.toLowerCase()
		.replace(/[^a-z0-9.]/g, "")
		.replace(/\.+/g, ".");
}

/**
 * Check if username exists in DB
 */
async function isUsernameTaken(username: string): Promise<boolean> {
	const exists = await User.exists({ username, isDeleted: false });
	return Boolean(exists);
}

/**
 * Generate a unique username by appending an incrementing number if needed
 */
export async function generateUniqueUsername(firstName: string, lastName: string): Promise<string> {
	const baseUsername = buildBaseUsername(firstName, lastName);

	let username = baseUsername;
	let counter = 1;

	while (await isUsernameTaken(username)) {
		username = `${baseUsername}${counter}`;
		counter++;
	}

	return username;
}
