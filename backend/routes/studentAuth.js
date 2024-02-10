const express = require("express");
const Student = require("../models/Student");
const route = express.Router();
const jwt = require("jsonwebtoken");

route.post("/student/signup", async (req, res) => {
  try {
    let { name, email, rollNo, password } = req.body;
    email = email.toLowerCase();
    rollNo = rollNo.toUpperCase();
    const checkStudent = await Student.findOne({ rollNo });
    if (checkStudent) {
      return res
        .status(500)
        .json({ success: false, msg: "Student already Exist" });
    }
    const student = await Student.create({
      name,
      rollNo,
      email,
      password,
    });
    const token = jwt.sign({ userId: student._id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
});

route.post("/student/signin", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    if (!email || !password) {
      return res
        .status(422)
        .json({ success: false, msg: "Please provide email or password" });
    }
    const student = await Student.findOne({ email });
    console.log(student);
    if (!student) {
      return res
        .status(422)
        .json({ success: false, msg: "Email Does Not Exist" });
    }
    try {
      await student.comparePassword(password);
      const token = jwt.sign({ userId: student._id }, "MY_SECRET_KEY");
      res.send({ token });
    } catch (err) {
      console.log(err);
      return res.status(422).json({ success: false, msg: "Wrong Password" });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
});

module.exports = route;
