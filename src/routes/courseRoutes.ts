import { Router } from "express";
import { getAllCourses, createCourse } from "../controllers/courseController";

const router = Router();

router.get("/getAllCourses", getAllCourses);
router.post("/createCourse", createCourse);

export default router;
