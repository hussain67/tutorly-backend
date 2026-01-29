import supertest from "supertest";
import app from "../../src/app";
import { describe, it, expect } from "vitest";

const request = supertest(app);

describe("getAllCourses Integration Test", () => {
	it("should get 200 OK from getAllCourses endpoint", async () => {
		const response = await request.get("/api/courses/getAllCourses").send({});
		expect(response.status).toBe(200);
	});
});
