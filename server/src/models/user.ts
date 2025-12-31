import { Schema, model } from "mongoose";

const userSchema = new Schema(
	{
		fName: { type: String, required: true },
		lName: { type: String, required: true },
		fullName: { type: String, required: true },

		email: { type: String },
		username: { type: String, required: true },

		password: { type: String, required: true },
		passwordChangedAt: { type: Date },
		passwordResettedAt: { type: Date },
		resetPasswordOTP: { type: Number },
		requiredToChangePassword: { type: Boolean },

		isDeleted: { type: Boolean, default: false },
		isActive: { type: Boolean, default: true },

		panelType: { type: String, enum: ["superAdmin", "client", "brand"], required: true },
		roles: [{ type: Schema.Types.ObjectId, ref: "roles" }],
	},
	{ timestamps: true }
);

userSchema.pre("validate", function () {
	this.fullName = `${this.fName} ${this.lName}`;
});

const User = model("users", userSchema);

export default User;
