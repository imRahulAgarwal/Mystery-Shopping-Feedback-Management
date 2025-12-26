import Logger from "./Logger.js";

export const errorLogger = new Logger({ enableDbLogging: true, folderPathArray: ["logs", "error"] });

export const httpLogger = new Logger({ enableDbLogging: false, folderPathArray: ["logs", "http"] });
