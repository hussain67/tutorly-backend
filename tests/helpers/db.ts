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
		   await mongoose.connect(
      process.env.MONGO_URI || "mongodb://mongodb:27017/testdb"
    );
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
