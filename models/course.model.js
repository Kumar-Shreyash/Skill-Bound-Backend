const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true, minlength: 20 },
  keywords: [{ type: String }],
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required:true},
  introVid:{type:String,required:true},
  content: { type: Object, required: true },
  rating: [
    {
      content: { type: Number, min: 1, max: 5 },
      instructor: { type: Number, min: 1, max: 5 },
      experience: { type: Number, min: 1, max: 5 },
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  totalRating:{type:Number,default:0},
  ratingCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  reviews: [
    {
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: { type: String, maxlength: 200 },
    },
  ],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const CourseModel = mongoose.model("Course", courseSchema);
module.exports = CourseModel;
