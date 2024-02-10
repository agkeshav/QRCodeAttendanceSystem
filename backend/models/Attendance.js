const mongoose = require("mongoose");

const AttendanceSchema = mongoose.Schema({
  courseId: String,
  date: String,
  hours: String,
  students: [],
  teacherId: String,
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
