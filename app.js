const express = require("express");
const path = require("path");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError.js");
const app = express();
const userRouter = require("./routes/userRouter");

app.use(cors());

app.options("*", cors());

app.use(helmet());

// Data sanitization against XSS
app.use(xss());
//CORS Request

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRouter);
// app.use('/api/board',boardRouter);

// app.all("*", (req, res, next) => {
//     next(new AppError(`No url found found for ${req.url}`, 404));
//   });

module.exports = app;
