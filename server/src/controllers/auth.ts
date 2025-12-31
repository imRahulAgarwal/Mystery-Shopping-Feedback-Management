import asyncHandler from "../middlewares/asyncMiddleware.js";
import { sendSuccess, sendError } from "../utils/responseUtil.js";
import User from "../models/user.js";
import { authSchema } from "../schemas/auth.js";
import { comparePassword } from "../utils/passwordUtil.js";
import { generateToken } from "../utils/tokenUtil.js";

export const login = asyncHandler(async (req, res) => {
	const validation = authSchema.validate(req.body);
	if (validation.error) {
		const errors = validation.error.details.map((issue) => ({ path: issue.path, message: issue.message }));
		sendError(res, 400, { errors });
		return;
	}

	const { username, password } = validation.value;
	const user = await User.findOne({ username });
	if (!user) {
		sendError(res, 404, { error: "User details not found." });
		return;
	}

	if (user.isDeleted || !user.isActive) {
		sendError(res, 400, { error: "Login restricted. Contact support team." });
		return;
	}

	const isValidPassword = await comparePassword(password, user.password);
	if (!isValidPassword) {
		sendError(res, 400, { error: "Invalid logn credentials." });
		return;
	}

	const token = generateToken({ userId: user._id.toString() });
	sendSuccess(res, 200, {
		user: { _id: user._id.toString(), name: user.fullName },
		token,
		message: "User logged in successfully.",
	});

	return;
});
