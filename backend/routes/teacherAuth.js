const express = require("express");
const Teacher = require("../models/Teacher");
const route = express.Router();
const jwt = require("jsonwebtoken");

route.post("/teacher/signup", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    const checkTeacher = await Teacher.findOne({ email });
    if (checkTeacher) {
      return res
        .status(500)
        .json({ success: false, msg: "Teacher already Exist" });
    }
    const teacher = await Teacher.create({
      email,
      password,
    });
    const token = jwt.sign({ userId: teacher._id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
});

route.post("/teacher/signin", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    
    if (!email || !password) {
      return res
        .status(422)
        .json({ success: false, msg: "Please provide email or password" });
    }
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res
        .status(422)
        .json({ success: false, msg: "Email Does Not Exist" });
    }
    try {
      await teacher.comparePassword(password);
      const token = jwt.sign({ userId: teacher._id }, "MY_SECRET_KEY");
      res.send({ token });
    } catch (err) {
      return res.status(422).json({ success: false, msg: "Wrong Password" });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
    console.log(err);
  }
});

module.exports = route;
