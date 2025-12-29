import mongoose from "mongoose";

const mongoUrl: string = process.env.MONGO_URL || "";

export default async function connectDatabase() {
	try {
		await mongoose.connect(mongoUrl);
		console.log("Database connected.");
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}
