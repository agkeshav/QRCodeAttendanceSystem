const express = require("express");
const app = express.Router();
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Course = require("../models/Course");

app.post("/attendance", async (req, res) => {
  let { codes, currentDate, rollNo } = req.body;
  codes = codes[0];
  codes = codes.value;
  codes = JSON.parse(codes);

  const courseId = codes.courseId;
  const teacherId = codes.teacherId;
  const dateObject = new Date(codes.date);
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const time = hours * 100 + minutes;
  const newDateObject = new Date(currentDate);
  const scantime = newDateObject.getHours() * 100 + newDateObject.getMinutes();
  const currentDateObj = new Date(currentDate);
  const year = currentDateObj.getFullYear();
  const month = ("0" + (currentDateObj.getMonth() + 1)).slice(-2);
  const day = ("0" + currentDateObj.getDate()).slice(-2);
  const formattedDate = `${year}-${month}-${day}`;

  if (codes.date.substring(0, 10) !== formattedDate || scantime - time > 300) {
    return res.status(200).json({ msg: "QR Expired", success: false });
  }
  try {
    const attd = await Attendance.find({
      courseId: courseId,
      date: codes.date.substring(0, 10),
    });
    if (attd.length > 0) {
      console.log(attd[0]);

      const foundStudent = attd[0].students.find(function (element) {
        return element.toString() === rollNo;
      });
      if (!foundStudent) {
        attd[0].students.push(rollNo);
        await attd[0].save();
      }
    } else {
      const newAttd = await Attendance.create({
        courseId,
        date: codes.date.substring(0, 10),
        hours: time,
        teacherId,
      });
      newAttd.students.push(rollNo);
      await newAttd.save();
    }
    res
      .status(200)
      .json({ success: true, msg: "Attedance Marked Successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
});

app.get("/studentattendance", async (req, res) => {
  var attendance = [];
  const { rollNo, courseId } = req.query;

  //fetch  all the courses of this particular student with the courseId and courseName
  try {
    const getCourse = await Course.findOne(
      { courseId: courseId },
      { students: 0, __v: 0 }
    );
    const cid = getCourse.courseId;
    const courseName = getCourse.courseName;
    attendance.push({ courseName: courseName, attd: [] });
    const attd = await Attendance.find(
      { courseId: cid },
      { teacherId: 0, __v: 0, hours: 0, _id: 0, courseId: 0 }
    );
    if (attd.length > 0) {
      await Promise.all(
        attd.map((item) => {
          var date = item.date;
          var stu = item.students;
          const found = stu.find((element) => element === rollNo);
          if (found) {
            attendance[0].attd.push({
              date: date,
              present: found ? "1" : "0",
            });
          }
        })
      );
      res.status(200).json({ success: true, msg: attendance });
    } else {
      res.status(200).json({ success: true, msg: [] });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

app.get("/teacherattendance", async (req, res) => {
  var attendance = [];
  const { teacherId, courseId } = req.query;
  try {
    const attde = await Attendance.find(
      { teacherId: teacherId, courseId: courseId },
      { teacherId: 0, courseId: 0, __v: 0, _id: 0, hours: 0 }
    );
    // find all the students associated with that particular courseId
    const stu = await Course.findOne(
      { courseId: courseId },
      { _id: 0, courseId: 0, courseName: 0, __v: 0 }
    ).populate("students");
    stu.students.map((item) => {
      attendance.push({ rollNo: item.rollNo, attd: [] });
    });

    attde.map((item) => {
      const date = item.date;
      const studs = item.students;
      studs.map((item2) => {
        attendance.map((item1) => {
          item1.attd.push({
            date: date,
            present: studs.includes(item2) ? "1" : "0",
          });
        });
      });
    });
    res.status(200).json({ success: true, msg: attendance });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

module.exports = app;
