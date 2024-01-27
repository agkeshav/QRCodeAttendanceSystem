const express = require("express");
const app = express.Router();
const Course = require("../models/Course");
const Teacher = require("../models/Teacher");

app.get("/courses", async (req, res) => {
  try {
    const allCourses = await Course.find({});
    res.status(200).json({ msg: allCourses, success: true });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", success: false });
  }
});

app.post("/courses", async (req, res) => {
  const { teacherId, courseId, courseName } = req.body;
  // console.log(courseId);
  try {
    const getCourse = await Course.find({ courseId: courseId });
    if (getCourse.length > 0) {
      return res
        .status(404)
        .json({ msg: "Course Already Exist", success: false });
    }
    const course = await Course.create({ courseId, courseName });
    const teacher = await Teacher.find({ teacherId: teacherId });
    teacher[0].courses.push(course);
    await teacher[0].save();
    res.status(201).json({ msg: course, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error", success: false });
  }
});
module.exports = app;
