const express=require("express")
const { addReview, addRating } = require("../controllers/review.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const ReviewRouter=express.Router()

ReviewRouter.post("/:courseId",authMiddleware(["student","instructor"]),addReview)

ReviewRouter.post("/rate/:courseId",authMiddleware(["student","instructor"]),addRating)

module.exports=ReviewRouter