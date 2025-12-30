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

	logger[level](eventName, message, {
		...extraData,
		context,
		durationMs: Number(process.hrtime.bigint() - startedAt) / 1_000_000,
		traceId: req.traceId,
	});
}
