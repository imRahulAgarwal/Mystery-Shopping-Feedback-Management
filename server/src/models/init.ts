import { Schema, model } from "mongoose";

const initSchema = new Schema(
	{
		key: { type: String, unique: true },
		initialized: { type: Boolean, default: false },
		lastInitialized: Date,
		permissionHash: String,
		permissionHashedAt: Date,
	},
	{ timestamps: true }
);

const Init = model("inits", initSchema);

export default Init;
