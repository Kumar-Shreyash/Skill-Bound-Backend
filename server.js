const express = require("express");
const connectToDB = require("./config/db.config");
const AuthRouter = require("./routes/auth.routes");
const CourseRouter = require("./routes/course.routes");
const ReviewRouter = require("./routes/review.routes");
const app = express();
require("dotenv").config;

app.use(express.json());
connectToDB();

app.use("/auth", AuthRouter);

app.use("/course",CourseRouter)

app.use("/review",ReviewRouter)

app.use((req, res) => {
  res.status(404).json({ message: "Invalid Route" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Running...");
});
