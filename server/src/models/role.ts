import { Schema, model } from "mongoose";

const roleSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		permissions: [{ type: Schema.Types.ObjectId, ref: "permissions" }],

		isDeleted: { type: Boolean, default: false },
		isActive: { type: Boolean, default: true },
		isAdmin: { type: Boolean, default: false },
		isGlobalRole: { type: Boolean, default: false },

		panelType: { type: String, enum: ["superAdmin", "client", "brand"], default: "superAdmin" },
	},
	{ timestamps: true }
);

const Role = model("roles", roleSchema);

export default Role;
