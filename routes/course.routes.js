const express=require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const { addCourse, updateCourse, deleteCourse, getAllCourses, getCourseById, getFilteredCourse, searchCourse } = require("../controllers/course.controller")
const CourseRouter=express.Router()

CourseRouter.post("/",authMiddleware(["instructor"]),addCourse)

CourseRouter.put("/:id",authMiddleware(["instructor"]),updateCourse)

CourseRouter.delete("/:id",authMiddleware(["instructor","admin"]),deleteCourse)

CourseRouter.get("/",getAllCourses)

CourseRouter.get("/:id",getCourseById)

CourseRouter.get("/filter",getFilteredCourse)

CourseRouter.get("/search",searchCourse)

module.exports=CourseRouter