import { errorLogger } from "../utils/loggers.js";
import { type ErrorRequestHandler } from "express";

const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
	const message = error.message || "Internal server error";
	const statusCode = error.statusCode || 500;

	errorLogger.error("GLOBAL_ERROR_MIDDLEWARE", message, {
		target: { error: error.message, stack: error.stack, statusCode },
	});

	return res.status(statusCode).json({ success: false, error: message });
};

export default errorMiddleware;
