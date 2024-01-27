const express = require("express");
const connectDB = require("./db/connect");
const axios = require("axios");
const cors = require("cors");
const bodyparser = require("body-parser");
require("dotenv").config();
const uri = process.env.MONGO_URI;
const app = express();
const studentAuth = require("./routes/studentAuth");
const teacherAuth = require("./routes/teacherAuth");
const authRequire = require("./middleware/authRequire");
const courseRoutes = require("./routes/courseRoutes");

app.use(cors({ origin: true, credentials: true }));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use(studentAuth);
app.use(teacherAuth);
app.use(courseRoutes);
app.use(authRequire);

app.get("/", authRequire, (req, res) => {
  res.send(req.user);
});

const PORT = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(uri);
    console.log("Connected to Database...");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
