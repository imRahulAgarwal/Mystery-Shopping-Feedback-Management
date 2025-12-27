import { Schema, model } from "mongoose";

const clientSchema = new Schema(
	{
		fName: String,
		lName: String,
		fullName: String,

		username: String,

		email: String,
		number: String,
		countryCode: String,

		password: String,
		passwordChangedAt: String,

		passwordResettedAt: String,
		requiresPasswordChange: Boolean,

		resetPasswordOTP: Number,
		otpExpiryTime: Date,
		isOtpVerified: Boolean,

		isDeleted: { type: Boolean, default: false },
		isActive: { type: Boolean, default: true },

		companyName: String,
		companyLogo: String,
		companyWebsite: String,

		industryId: { type: Schema.Types.ObjectId, ref: "industries" },
		remarks: String,
	},
	{ timestamps: true }
);

const Client = model("clients", clientSchema);

export default Client;
