import type { Types } from "mongoose";
import User from "../models/user.js";
import { sendError } from "../utils/responseUtil.js";
import { verifyToken } from "../utils/tokenUtil.js";
import asyncHandler from "./asyncMiddleware.js";
import jwt from "jsonwebtoken";
import Role from "../models/role.js";
import Permission from "../models/permission.js";

export const isNotLoggedIn = asyncHandler(async (req, _, next) => {
	const authToken = req.headers.authorization?.split(" ")[1];
	if (authToken) {
		try {
			verifyToken(authToken);
		} catch (error) {
			next();
			return;
		}
	}

	next();
	return;
});

export const isLoggedIn = asyncHandler(async (req, res, next) => {
	const authToken = req.headers.authorization?.split(" ")[1];
	if (!authToken) {
		sendError(res, 401, { error: "Authentication token not provided." });
		return;
	}

	let payload = null;
	try {
		payload = verifyToken(authToken) as { userId: Types.ObjectId };
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			sendError(res, 401, { error: "Authentication token expired." });
			return;
		} else if (error instanceof jwt.JsonWebTokenError) {
			sendError(res, 401, { error: "Invalid authentication token." });
			return;
		}

		sendError(res, 401, { error: "Authentication failed." });
		return;
	}

	const user = await User.findOne({ _id: payload.userId });
	if (!user) {
		sendError(res, 401, {});
		return;
	}

	if (!user.isActive || user.isDeleted) {
		sendError(res, 401, {});
		return;
	}

	const roles = await Role.find({ _id: { $in: user.roles } });
	const permissions = await Permission.find({ _id: { $in: roles.flatMap((permission) => permission._id) } });

	const userPermissions = permissions.map((permission) => permission.uniqueName);
	req.isLoggedIn = true;
	req.userPermissions = userPermissions;
	req.loggedInUser = {
		_id: user._id,
		fName: user.fName,
		lName: user.lName,
		fullName: user.fullName,
		email: user.email || "",
		username: user.username,
		panelType: user.panelType,
	};

	const isAdmin = roles.some((role) => role.isAdmin);
	req.isAdmin = isAdmin;

	next();
	return;
});

export const checkPermission = (requiredPermission: string, allowAdminOnly?: boolean) =>
	asyncHandler(async (req, res, next) => {
		const userPermissions = req.userPermissions!;
		const isAdmin = req.isAdmin;

		if (allowAdminOnly && !isAdmin) {
			sendError(res, 403, { error: "Admin is only allowed." });
			return;
		}

		if (!requiredPermission || isAdmin) {
			next();
			return;
		}

		const permissions = requiredPermission.split(",");
		const hasPermission = userPermissions.some((perm) => permissions.some((reqPerm) => reqPerm === perm));

		if (!hasPermission) {
			sendError(res, 403, { error: "Cannot access the resource." });
			return;
		}

		next();
		return;
	});
