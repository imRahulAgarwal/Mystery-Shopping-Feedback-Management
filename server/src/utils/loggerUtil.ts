import type { Request } from "express";
import Logger, { type LogData } from "./Logger.js";

type LogContext = {
	req: Request;
	logger: Logger;
	eventName: string;
	startedAt: bigint;
	context: { panel: string; module: string };
};

export const initLogData = (
	req: Request,
	logger: Logger,
	eventName: string,
	context: { panel: string; module: string }
): LogContext => {
	return {
		req,
		logger,
		eventName,
		context,
		startedAt: process.hrtime.bigint(),
	};
};

export function logActivity(
	logContext: LogContext,
	level: "debug" | "info" | "warn" | "error",
	message: string,
	extraData: Omit<LogData, "context" | "durationMs" | "traceId">
) {
	const { logger, context, eventName, req, startedAt } = logContext;

	let actor = {};
	if (req.isLoggedIn && req.loggedInUser) {
		actor = { id: req.loggedInUser._id, name: req.loggedInUser.fullName, permissions: req.userPermissions };
	}

	logger[level](eventName, message, {
		...extraData,
		...(req.isLoggedIn ? { actor } : []),
		context,
		durationMs: Number(process.hrtime.bigint() - startedAt) / 1_000_000,
		traceId: req.traceId,
	});
}
