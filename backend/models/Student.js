const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const StudentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  rollNo: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  studentCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

StudentSchema.pre("save", function (next) {
  const student = this;
  if (!student.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(student.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      student.password = hash;
      next();
    });
  });
});

StudentSchema.methods.comparePassword = function (candidatePassword) {
  const student = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, student.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      if (!isMatch) {
        return reject(err);
      }
      resolve(true);
    });
  });
};

module.exports = mongoose.model("Student", StudentSchema);
