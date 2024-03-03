const express = require("express");
const app = express.Router();

const Student = require("../models/Student");
const Course = require("../models/Course");

app.get("/students", async (req, res) => {
  try {
    const allStudents = await Student.find(
      {},
      { name: 0, password: 0, studentCourses: 0, email: 0, _id: 0, __v: 0 }
    );
    res.status(200).json({ msg: allStudents, success: true });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", success: false });
  }
});

app.get("/studentcourses", async (req, res) => {
  
  const { rollNo } = req.query;
  var courses = [];
  try {
    const student = await Student.findOne(
      { rollNo: rollNo },
      { studentCourses: 1, _id: 0 }
    ).populate("studentCourses");
    if (!student) {
      return res
        .status(404)
        .json({ success: false, msg: "No student find with this Roll No" });
    }
    student.studentCourses.map((item) => {
      courses.push({ courseId: item.courseId, courseName: item.courseName });
    });
    res.status(200).json({ success: true, msg: courses });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});
module.exports = app;
