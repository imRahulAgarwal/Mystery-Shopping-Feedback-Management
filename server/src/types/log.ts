import { Types } from "mongoose";

export interface LogType {
	timestamp: Date;
	level: "debug" | "info" | "warn" | "error";
	event: string;
	message: string;

	actor?: {
		id?: Types.ObjectId;
		name?: string;
		permissions?: string[];
	};

	context?: {
		panel?: string;
		module?: string;
	};

	security?: {
		ip?: string;
		userAgent?: string;
		sessionId?: string;
	};

	traceId?: string;
	status?: "success" | "error";
	durationMs?: number;
	target?: unknown;
	meta?: unknown;
}
