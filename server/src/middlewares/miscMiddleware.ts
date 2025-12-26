import { randomUUID } from "crypto";
import type { RequestHandler } from "express";

export const addTraceId: RequestHandler = (req, _res, next) => {
	req.traceId = randomUUID();
	next();
};
