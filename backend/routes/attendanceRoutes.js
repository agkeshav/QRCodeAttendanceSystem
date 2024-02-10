const express = require("express");
const app = express.Router();
const Attendance = require("../models/Attendance");

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

module.exports = app;
