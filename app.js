const express = require("express");
const path = require("path");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError.js");
const app = express();

const userRouter = require("./routes/userRouter");
const topicRouter = require("./routes/topicRouter");
const taskRouter = require("./routes/taskRouter");
const announcementRouter = require("./routes/announcementRouter");

app.use(cors());

app.options("*", cors());

app.use(helmet());

// Data sanitization against XSS
app.use(xss());
//CORS Request

app.use(express.json());
app.use(cookieParser());

//"/api/auth"

app.use("/api/v1/users", userRouter);
app.use("/api/v1/board/topics",topicRouter);
app.use("/api/v1/board/announcements", announcementRouter);
app.use("/api/v1/board/topics/:topic_id/tasks", taskRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`No url found found for ${req.url}`, 404));
});

module.exports = app;
