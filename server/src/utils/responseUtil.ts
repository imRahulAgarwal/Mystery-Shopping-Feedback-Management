import type { Response } from "express";

type ObjectData = Record<string, unknown>;

type SuccessResponse = {
	success: true;
	data: ObjectData;
};

type ErrorResponse = {
	success: false;
	data: ObjectData;
};

export function sendSuccess(res: Response, statusCode: number, data: ObjectData): Response<SuccessResponse> {
	return res.status(statusCode).json({
		success: true,
		...data,
	});
}

export function sendError(res: Response, statusCode: number, data: ObjectData): Response<ErrorResponse> {
	return res.status(statusCode).json({
		success: false,
		...data,
	});
}
