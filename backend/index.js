const express = require("express");
const connectDB = require("./db/connect");
const axios = require("axios");
const cors = require("cors");
const bodyparser = require("body-parser");
require("dotenv").config();
const uri = process.env.MONGO_URI;
const app = express();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const studentAuth = require("./routes/studentAuth");
const teacherAuth = require("./routes/teacherAuth");
const authRequire = require("./middleware/authRequire");
const courseRoutes = require("./routes/courseRoutes");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const teacherRoutes = require("./routes/teacherRoutes")
const Student = require("./models/Student");
const Course = require("./models/Course");
const Teacher = require("./models/Teacher");

app.use(cors({ origin: true, credentials: true }));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use(studentAuth);
app.use(teacherAuth);
app.use(courseRoutes);
app.use(studentRoutes);
app.use(teacherRoutes)
app.use(attendanceRoutes);
app.use(authRequire);

app.get("/", authRequire, (req, res) => {
  res.send(req.user);
});

app.post("/enrollStudents", async (req, res) => {
  const { allStudent, value } = req.body;
  if (allStudent.length == 0) {
    return res.status(200).json({ msg: "No student to enroll", success: true });
  }
  try {
    // TODO
    const course = await Course.find({ courseId: value });
    for (var i = 0; i < allStudent.length; i++) {
      const student = await Student.find({ rollNo: allStudent[i].rollNo });
      const foundStudent = course[0].students.find(function (element) {
        return element.toString() === student[0]._id.toString();
      });
      if (!foundStudent) {
        student[0].studentCourses.push(course[0]._id);
        await student[0].save();
        course[0].students.push(student[0]._id);
        await course[0].save();
      }
    }
    res
      .status(200)
      .json({ msg: "Students successfully enrolled", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error", success: false });
  }
});

app.post("/generateqr", async (req, res) => {
  const { courseId, teacherId } = req.body;
  try {
    const course = await Course.findOne({ courseId: courseId });
    if (!course) {
      return res.status(200).json({ msg: "No course found", success: false });
    }
    const getCourse = await Teacher.findOne({ teacherId: teacherId }).populate(
      "courses",
      "courseId"
    );
    // Check if the courseId exists in the array of courses
    const courseIdExists = getCourse.courses.some(
      (course) => course.courseId === courseId
    );
    if (!courseIdExists) {
      return res.status(200).json({
        msg: "This course is not associated with this teacher",
        success: false,
      });
    }
    return res.status(200).json({ msg: "All Details OK", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error", success: false });
  }
});


const PORT = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(uri);
    console.log("Connected to Database...");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
