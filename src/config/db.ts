import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";
export async function connectDB() {
	try {
		await mongoose.connect(env.DATABASE_URL);
		logger.info("Database connected successfully");
	} catch (error) {
		logger.error("Database connection failed", error);
		process.exit(1);
	}
}
