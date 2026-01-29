import { connectTestDB, clearTestDB, closeTestDB } from "./helpers/db";
import { beforeAll, afterEach, afterAll } from "vitest";

beforeAll(async () => {
	await connectTestDB();
});
afterEach(async () => {
	await clearTestDB();
});
afterAll(async () => {
	await closeTestDB();
});
