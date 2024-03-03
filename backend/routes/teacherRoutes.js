const express = require("express");
const app = express.Router();

const Teacher = require("../models/Teacher");
app.get("/teachercourses", async (req, res) => {
  const { teacherId } = req.query;
  var result = [];
  try {
    const teacher = await Teacher.findOne(
      { teacherId: teacherId },
      { courses: 1, _id: 0 }
    ).populate("courses");
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, msg: "No teacher find with this Teacher Id" });
    }
    teacher.courses.map((item) => {
      result.push({ courseId: item.courseId, courseName: item.courseName });
    });
    res.status(200).json({ success: true, msg: result });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});
module.exports = app;
