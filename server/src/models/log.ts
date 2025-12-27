import { Schema, model } from "mongoose";

const logSchema = new Schema(
	{
		timestamp: { type: Date, required: true },
		level: { type: String, enum: ["debug", "info", "warn", "error"], required: true },
		event: { type: String, required: true },
		message: { type: String, required: true },

		actor: {
			id: Schema.Types.ObjectId,
			name: String,
			permissions: [String],
		},

		context: {
			panel: String, // Panel Types i.e., client, brand, superAdmin
			module: String, // Module i.e., Auth, Clients
		},

		security: {
			ip: String,
			userAgent: String,
			sessionId: String,
		},

		traceId: String,
		status: { type: String, enum: ["success", "error"] },
		durationMs: Number,
		target: Schema.Types.Mixed,
		meta: Schema.Types.Mixed,
	},
	{ timestamps: true }
);

const LogEntry = model("logs", logSchema);

export default LogEntry;
