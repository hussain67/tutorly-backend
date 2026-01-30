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
	if (mongoose.connection.readyState !== 0) {
		await mongoose.connection.dropDatabase();
		await mongoose.connection.close();
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
