import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo: MongoMemoryServer;

export const connectTestDB = async () => {
	mongo = await MongoMemoryServer.create({
		binary: {
			version: "6.0.13" // ✅ stable on macOS
		}
	});

	const uri = mongo.getUri();
	await mongoose.connect(uri);
};

export const closeTestDB = async () => {
	if (mongoose.connection.readyState !== 0) {
		await mongoose.connection.dropDatabase();
		await mongoose.connection.close();
	}

	if (mongo) {
		await mongo.stop();
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
