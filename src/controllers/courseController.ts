import { json, Request, Response } from "express";
import Course from "../models/courseModel";

export async function getAllCourses(req: Request, res: Response) {
	// Implementation for fetching courses
	res.status(200).json("List of courses");
}

export async function createCourse(req: Request, res: Response) {
	// Implementation for creating a course
	await Course.create(req.body);
	res.status(201).json("Course created");
}
