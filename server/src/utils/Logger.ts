import path from "path";
import winston from "winston";
import "winston-daily-rotate-file";
import { projectRootPath } from "../constants.js";
import { Writable } from "stream";
import LogEntry from "../models/log.js";
import type { LogType } from "../types/log.js";

type TLoggerOptions = {
	folderPathArray: string[];
	enableDbLogging: boolean;
};

export type LogData = Partial<Omit<LogType, "level" | "event" | "message" | "timestamp">>;

class Logger {
	logFolderPath: string = "";
	enableDbLogging: boolean = false;
	logger: winston.Logger | null = null;
	dbFailureCount: number = 0;
	dbDisabled: boolean = false;

	constructor(options: TLoggerOptions) {
		this.logFolderPath = this.resolveLogFolderPath(options.folderPathArray);
		this.enableDbLogging = options.enableDbLogging;
		try {
			this.logger = winston.createLogger({
				level: this.getEnvironmentLogLevel(),
				format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
				transports: [this.getFileTransport(), this.getDatabaseTransport()],
			});
		} catch (error) {
			this.logger = winston.createLogger({
				level: "info",
				format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
				transports: [new winston.transports.Console()],
			});
		}
	}

	resolveLogFolderPath(folderPathArray: string[]): string {
		const folderPath = path.join(projectRootPath, "..", ...folderPathArray);
		return folderPath;
	}

	getFileTransport() {
		return new winston.transports.DailyRotateFile({
			dirname: this.logFolderPath,
			datePattern: "DD-MM-YYYY",
			extension: ".jsonl",
			filename: "%DATE%",
			zippedArchive: true,
			maxSize: "20m",
			utc: true,
		});
	}

	getDatabaseTransport() {
		const dbStream = new Writable({
			write: (chunk, _encoding, callback) => {
				if (this.dbDisabled || !this.enableDbLogging) {
					callback();
					return;
				}

				const logStr = chunk.toString();
				setImmediate(async () => {
					let data;

					try {
						data = JSON.parse(logStr);
					} catch (error) {
						let errorMessage = error instanceof Error ? error.message : "Internal issue.";
						console.error("[Logger JSON Parse Error]", errorMessage);
						callback();
						return;
					}

					try {
						await LogEntry.create({
							timestamp: data.timestamp,
							level: data.level,
							event: data.event,
							message: data.message,
							actor: data.actor,
							context: data.context,
							security: data.security,
							traceId: data.traceId,
							status: data.status,
							durationMs: data.durationMs,
							target: data.target,
							meta: data.meta,
						});
						this.dbFailureCount = 0;
					} catch (error) {
						let errorMessage = error instanceof Error ? error.message : "Internal issue.";
						console.error("[DB Logging Error]", errorMessage);
						this.dbFailureCount++;

						// Disable after 10 consecutive failures
						if (this.dbFailureCount >= 10) {
							this.dbDisabled = true;
							console.error("[DB Logging DISABLED] - Too many failures.");
						}
					}
					callback();
				});
			},
		});
		return new winston.transports.Stream({ stream: dbStream, level: "info" });
	}

	getEnvironmentLogLevel() {
		const env = process.env.NODE_ENV || "DEVELOPMENT";
		return env === "DEVELOPMENT" ? "debug" : "info";
	}

	log(level: LogType["level"], event: LogType["event"], message: LogType["message"], data: LogData = {}): void {
		this.logger?.log(level, {
			event,
			message,
			...data,
		});
	}

	info(event: string, message: string, data?: LogData): void {
		this.log("info", event, message, data);
	}

	debug(event: string, message: string, data?: LogData): void {
		this.log("debug", event, message, data);
	}

	warn(event: string, message: string, data?: LogData): void {
		this.log("warn", event, message, data);
	}

	error(event: string, message: string, data?: LogData): void {
		this.log("error", event, message, data);
	}
}

export default Logger;
