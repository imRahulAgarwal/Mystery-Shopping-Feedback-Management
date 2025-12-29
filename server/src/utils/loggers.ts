import Logger from "./Logger.js";

export const errorLogger = new Logger({
	enableDbLogging: true,
	folderPathArray: ["logs", "error"],
	enableExceptionRejectionHandlers: true,
});

export const httpLogger = new Logger({ enableDbLogging: false, folderPathArray: ["logs", "http"] });

export const industryLogger = new Logger({ enableDbLogging: true, folderPathArray: ["logs", "industries"] });
