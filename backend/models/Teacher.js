const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const TeacherSchema = mongoose.Schema({
  teacherId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

TeacherSchema.pre("save", function (next) {
  const teacher = this;
  if (!teacher.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(teacher.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      teacher.password = hash;
      next();
    });
  });
});

TeacherSchema.methods.comparePassword = function (candidatePassword) {
  const teacher = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, teacher.password, (err, isMatch) => {
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
module.exports = mongoose.model("Teacher", TeacherSchema);
