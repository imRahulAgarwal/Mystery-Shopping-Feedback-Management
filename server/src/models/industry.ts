import { Schema, model } from "mongoose";

const industrySchema = new Schema(
	{
		name: { type: String, required: true },
		slug: { type: String, required: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const Industry = model("industries", industrySchema);

export default Industry;
