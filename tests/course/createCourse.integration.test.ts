import supertest from "supertest";
import app from "../../src/app";
import { describe, it, expect } from "vitest";

const request = supertest(app);

describe("createCourse Integration Test", () => {
	it("should get 201 Created from createCourse endpoint", async () => {
		const response = await request.post("/api/courses/createCourse").send({
			title: "New Course",
			description: "Course Description",
			duration: 10,
			price: 99.99
		});
		expect(response.status).toBe(201);
	});
});
