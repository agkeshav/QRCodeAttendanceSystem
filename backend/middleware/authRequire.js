const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, "MY_SECRET_KEY", async (err, payload) => {
    if (err) return res.status(401).send({ error: "You must be logged in" });
    const { userId:id } = payload;
    const student = await Student.findById(id);
    const teacher = await Teacher.findById(id);
    if (student) {
      req.user = { data: student, role: "Student" };
    }
    if (teacher) {
      req.user = { data: teacher, role: "Teacher" };
    }
    next();
  });
};
