import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";



let mongoServer: MongoMemoryServer;

export const connectTestDB = async () => {

	if(!process.env.CI){
	mongoServer = await MongoMemoryServer.create({
		binary: {
			version: "6.0.13" // ✅ stable on macOS
		}
	})
	}else{
		const mongoUri =
			process.env.MONGODB_URI ||
			process.env.MONGO_URI ||
			"mongodb://mongodb:27017/testdb";

		const connectWithRetry = async (
			uri: string,
			retries = 10,
			delayMs = 3000
		) => {
			for (let attempt = 1; attempt <= retries; attempt++) {
				try {
					console.log(`[MongoDB] Attempt ${attempt}/${retries}: Connecting to ${uri}`);
					await mongoose.connect(uri, {
						serverSelectionTimeoutMS: 10000,
						connectTimeoutMS: 10000,
						socketTimeoutMS: 10000
					});
					console.log(`[MongoDB] Connected successfully on attempt ${attempt}`);
					return;
				} catch (error) {
					console.error(`[MongoDB] Connection attempt ${attempt} failed:`, (error as Error).message);
					if (attempt === retries) {
						throw new Error(`Failed to connect to MongoDB after ${retries} attempts: ${(error as Error).message}`);
					}
					await new Promise((resolve) => setTimeout(resolve, delayMs));
				}
			}
		};

		await connectWithRetry(mongoUri);
  }};

export const closeTestDB = async () => {
	try {
		if (mongoose.connection.readyState !== 0) {
			await Promise.race([
				mongoose.connection.dropDatabase(),
				new Promise((_, reject) =>
					setTimeout(() => reject(new Error("dropDatabase timeout")), 5000)
				)
			]);
			await mongoose.connection.close();
		}
	} catch (error) {
		console.error("[MongoDB] Error closing database:", (error as Error).message);
	}

	if (mongoServer) {
		await mongoServer.stop();
	}
};

export const clearTestDB = async () => {
	const collections = mongoose.connection.collections;
	for (const key in collections) {
		await collections[key].deleteMany({});
	}
};
if (process.env.NODE_ENV !== "test") {
	throw new Error("❌ MongoMemoryServer must only run in test environment");
}
