const CourseModel = require("../models/course.model");
const UserModel = require("../models/user.model");

const addCourse = async (req, res) => {
  try {
    let userId = req.user;
    await CourseModel.create({ ...req.body, instructor: userId });
    res.status(201).json({ message: "Course added successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" });
  }
};

const updateCourse = async (req, res) => {
  try {
    let userId = req.user;
    let { id } = req.params;
    let course = await CourseModel.findById(id);
    if (!course || course.instructor !== userId) {
      return res.status(404).json({ message: "No course found." });
    }
    await CourseModel.findByIdAndUpdate(id, req.body);
    res.status(200).json({ message: "Course updated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later " });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;
    const role = user.role;
    const course = await CourseModel.findById(id);
    if (!course) {
      return res.status(404).json({ message: "No course found." });
    }
    if (course.instructor === userId || role === "admin") {
      await CourseModel.findByIdAndDelete(id);
      return res.status(200).json({ message: "Course Deleted" });
    } else {
      return res.status(401).json({ message: "Unauthorized action." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" });
  }
};

const getAllCourses = async (req, res) => {
  try {
    let courses = await CourseModel.find();
    res.status(200).json({ message: "Course List", courses });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" });
  }
};

const getCourseById = async (req, res) => {
  try {
    let { id } = req.params;
    let course = await CourseModel.findById(id);
    let course1=await CourseModel.find({instructor:id})
    if (!course && !course1) {
      return res.status(404).json({ message: "No course found" });
    }
    if(!course && course1){
      return res.status(200).json({message:"Course found",course1})
    }
    res.status(200).json({ message: "Course found", course });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" });
  }
};

const getFilteredCourse = async (req, res) => {
  try {
    const { rating, price, title, instructor } = req.query;
    if (rating && !price && !title && !instructor) {
      let courses = await CourseModel.find({
        averageRating: { $gte: +rating },
      }).sort({ averageRating: -1 });
      return res.status(200).json({
        message: `Courses with average rating of ${rating} or above`,
        courses,
      });
    }
    if (!rating && price && !title && !instructor) {
      let courses = await CourseModel.find({ price: { $lte: +price } }).sort({
        price: 1,
      });
      return res
        .status(200)
        .json({ message: `Courses with price of ${+price} or less`, courses });
    }
    if (!rating && !price && title && !instructor) {
      let courses = await CourseModel.find({
        title: { $regex: title, $options: "i" },
      });
      return res
        .status(200)
        .json({ message: `Courses with ${title}`, courses });
    }
    if (!rating && !price && !title && instructor) {
      let courses = await UserModel.find({
        name: { $regex: instructor, $options: "i" },
        role: "instructor",
      }).populate("courses");
      return res
        .status(200)
        .json({ message: `Courses by ${instructor}`, courses });
    }
    res.status(404).json({ message: "No Course Found" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" });
  }
};

const searchCourse = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Please provide a search query" });
    }

    const instructors = await UserModel.find({
      role: "instructor",
      $or: [
        { name: { $regex: query, $options: "i" } },
        { expertise: { $regex: query, $options: "i" } },
      ],
    }).select("_id");

    const instructorsId = instructors.map((ele) => ele._id);

    const courses = await CourseModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { keywords: { $regex: query, $options: "i" } },
        { instructor: { $in: instructorsId } },
      ],
    }).populate("instructor", "name expertise");

    res.status(200).json({ message: `Serach results for ${query}`, courses });
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" });
  }
};

const courseEnrollment=async(req,res)=>{
  try {
      let userId=req.user
      let {id}=req.params
      let course=await CourseModel.findById(id)
      if(!course){
          return res.status(404).json({message:"No course found"})
      }
      if(JSON.stringify(userId)===JSON.stringify(course.instructor)){
          return res.status(400).json({message:"Can't enroll in your own course"})
      }
      let instructor=await UserModel.findById(course.instructor)
      let user=await UserModel.findById(userId)
      if(user.courses.includes(course._id)){
        return res.status(400).json({message:"Already enrolled"})
      }
      console.log(userId)
      user.courses.push(id)
      await user.save()
      course.students.push(userId)
      await course.save()
      instructor.totalRevenue+=+course.price
      await instructor.save()
      res.status(200).json({message:`Enrolled in ${course.title} successfully`})
  } catch (error) {
    console.log(error)
      res.status(500).json({message:"Something went wrong, please try again later"})
  }
}

module.exports = {
  addCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getFilteredCourse,
  searchCourse,
  courseEnrollment
};
