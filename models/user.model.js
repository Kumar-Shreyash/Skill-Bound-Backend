const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    default: "student",
  },
  bio: { type: String, maxlength: 500 },
  social: {
    linkedin: { type: String },
    github: { type: String },
    instagram: { type: String },
  },
  expertise: [{ type: String }],
  preferredLanguages:[{ type: String }],
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  image: {
    type: String,
    default:
      "https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg",
  },
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
