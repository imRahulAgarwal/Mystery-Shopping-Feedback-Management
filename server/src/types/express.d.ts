import { Request } from "express";
import type { Types } from "mongoose";

declare global {
	namespace Express {
		interface Request {
			traceId: string;
			isLoggedIn?: boolean;
			loggedInUser?: {
				_id: Types.ObjectId;
				fName: string;
				lName: string;
				fullName: string;
				email: string;
				username: string;
				panelType: string;
			};
			userPermissions?: string[];
			isAdmin?: boolean;
		}
	}
}

export {};
