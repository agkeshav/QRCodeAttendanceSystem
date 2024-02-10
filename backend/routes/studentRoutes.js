const express = require("express");
const app = express.Router();

const Student = require("../models/Student");

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

module.exports = app;
