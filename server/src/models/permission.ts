import { Schema, model } from "mongoose";

const permissionSchema = new Schema(
	{
		displayName: { type: String, required: true },
		uniqueName: { type: String, required: true },
		moduleName: { type: String, required: true },
		panelType: { type: String, enum: ["superAdmin", "client", "brand"], required: true },
		isReadPermission: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const Permission = model("permissions", permissionSchema);

export default Permission;
