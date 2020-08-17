const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const AppError = require("../../utils/appError");

const comments = [
  {
    userName: "Dummy",
    body:
      "lorem ipsum dolor sit amet, consectetur adipiscing lorem ipsum dolor sit amet, consectetur adipiscing lorem ipsum dolor sit amet, consectetur adipiscing lorem ipsum dolor sit amet, consectetur adipiscing ",
    timestamp: "12/4/2001 23:45",
  },
  {
    userName: "Dummy",
    body:
      "lorem ipsum dolor sit amet, consectetur adipiscing lorem ipsum dolor sit amet, consectetur adipiscing lorem ipsum dolor sit amet, consectetur adipiscing lorem ipsum dolor sit amet, consectetur adipiscing ",
    timestamp: "12/4/2001 23:45",
  },
  {
    userName: "Dummy",
    body:
      "lorem ipsum dolor sit amet, consectetur adipiscing lorem ipsum dolor sit amet, consectetur adipiscing lorem ipsum dolor sit amet, consectetur adipiscing lorem ipsum dolor sit amet, consectetur adipiscing ",
    timestamp: "12/4/2001 23:45",
  },
  {
    userName: "Dummy",
    body:
      "lorem ipsum dolor sit amet, consectetur adipiscing lorem ipsum dolor sit amet, consectetur adipiscing lorem ipsum dolor sit amet, consectetur adipiscing lorem ipsum dolor sit amet, consectetur adipiscing ",
    timestamp: "12/4/2001 23:45",
  },
  {
    userName: "Dummy",
    body:
      "lorem ipsum dolor sit amet, consectetur adipiscing lorem ipsum dolor sit amet, consectetur adipiscing lorem ipsum dolor sit amet, consectetur adipiscing lorem ipsum dolor sit amet, consectetur adipiscing ",
    timestamp: "12/4/2001 23:45",
  },
];

exports.generateReport = async (req, res, next) => {
  try {
    const options = {
      height: "11.25in",
      width: "8.5in",
      header: {
        height: "5mm",
      },
      footer: {
        height: "5mm",
      },
      border: "1.5px",
    };
    ejs.renderFile(
      path.join(__dirname, "comment-template.ejs"),
      {
        comments: comments,
      },
      (err, data) => {
        if (err) {
          console.log(err);
          throw new AppError("Err Reading the Data", 500);
        } else {
          pdf
            .create(data, options)
            .toFile(path.join(__dirname, "report.pdf"), function (err, data) {
              if (err) {
                throw new AppError("Err While Maikng PDF", 500);
              } else {
                res.send("File created successfully");
              }
            });
        }
      }
    );
  } catch (err) {
    return next(err);
  }
};
