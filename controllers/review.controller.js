const CourseModel = require("../models/course.model");
const UserModel = require("../models/user.model");

const addRating = async (req, res) => {
  try {
    let user = req.user;
    let { courseId } = req.params;
    let course = await CourseModel.findById(courseId);
    let { content, instructor, experience } = req.body;
    if (
      content < 1 ||
      content > 5 ||
      instructor < 1 ||
      instructor > 5 ||
      experience < 1 ||
      experience > 5
    ) {
      return res
        .status(400)
        .json({ message: "Rating should be in between 1-5" });
    }
    if (!course) {
      return res.status(404).json({ message: "No Course Found" });
    }
    if (JSON.stringify(course.instructor) === JSON.stringify(user)) {
      return res.status(400).json({ message: "Can't rate your own course" });
    }
    const hasRated = course.rating.some(
      (r) => r.by.toString() === user.toString()
    );
    if (hasRated) {
      return res.status(400).json({ message: "Already rated the course" });
    }

    if (course.students.includes(user)) {
      course.rating.push({
        content: +content,
        instructor: +instructor,
        experience: +experience,
        by: user,
      });
      course.ratingCount++;
      course.totalRating += (+content + +instructor + +experience) / 3;
      course.averageRating = course.totalRating / course.ratingCount;
      await course.save();
      return res.status(200).json({ message: "Rating submited successfully" });
    } else {
      return res
        .status(401)
        .json({ message: `Not enrolled in ${course.title}` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" });
  }
};

const addReview = async (req, res) => {
  try {
    let user = req.user;
    let { courseId } = req.params;
    let { content } = req.body;
    let course = await CourseModel.findById(courseId);
    console.log(course);

    if (!course) {
      return res.status(404).json({ message: "No course found" });
    }
    if (JSON.stringify(course.instructor) === JSON.stringify(user)) {
      return res
        .status(400)
        .json({ message: "Can't add a review for your own course" });
    }
    const hasReviewed = course.reviews.some(
        (r) => r.by.toString() === user.toString()
      );
      if (hasReviewed) {
        return res.status(400).json({ message: "Already reviewed the course" });
      }
    if (course.students.includes(user)) {
      course.reviews.push({ content, by: user });
      await course.save();
      return res
        .status(200)
        .json({ message: `Review successfully added for ${course.title}` });
    } else {
      return res.status(400).json({ message: "Not enrolled in the course." });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { addRating, addReview };
