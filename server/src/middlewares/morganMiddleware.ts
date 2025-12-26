import morgan from "morgan";
import { httpLogger } from "../utils/loggers.js";
import type { Request, Response } from "express";

morgan.token("traceId", (req: Request) => req.traceId);

let morganFormat =
	"Trace ID: :traceId | Method: :method | URL: :url | Status: :status | Total Time: :total-time ms | Content-Length: :res[content-length]";

if (process.env.NODE_ENV === "PRODUCTION") {
	morganFormat += " | IP: :remote-addr";
}

const skip = (req: Request, _res: Response): boolean => {
	if (!req.url) return false;
	return req.url.startsWith("/uploads");
};

const morganMiddleware = morgan(morganFormat, {
	stream: { write: (message) => httpLogger.info("HTTP_REQUEST", message.trim(), { context: { module: "HTTP" } }) },
	skip,
});

export default morganMiddleware;
