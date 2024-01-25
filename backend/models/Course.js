const mongoose = require("mongoose");
const CourseSchema = mongoose.Schema({
  courseId: {
    type: String,
    unique: true,
    required: true,
  },
  courseName: {
    type: String,
    unique: true,
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

module.exports = mongoose.model("Course", CourseSchema);
