import type { Request } from "express";
import Logger, { type LogData } from "./Logger.js";

type TLogActivity = {
	req: Request;
	logger: Logger;
	level: "debug" | "info" | "warn" | "error";
	eventName: string;
	message: string;
	extraData: LogData;
	startedAt: bigint;
};

export function logActivity(logData: TLogActivity) {
	const { logger } = logData;
	const { req, level, eventName, message, startedAt, extraData } = logData;

	if (logger[level]) {
		logger[level](eventName, message, {
			...extraData,
			// security: { ip: req.ip, userAgent: req.get("user-agent"), sessionId: "s" },
			// actor: { id: req.loggedInUser._id, name: req.loggedInUser.fullName, permissions: req.userPermissions },
			durationMs: Number(process.hrtime.bigint() - startedAt) / 1_000_000,
			traceId: req.traceId,
		});
	} else {
	}
}
