import { Types } from "mongoose";

const validateObjectId = (id: string | undefined): boolean =>
	!!(id && Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === String(id));

export default validateObjectId;
