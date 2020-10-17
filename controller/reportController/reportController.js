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

const entries = [
  {
    id: 1,
    name: "binod",
    points: 60,
    old_rank: 2,
    current_rank: 1,
  },
  {
    id: 9,
    name: "binod",
    points: 30,
    old_rank: 1,
    current_rank: 2,
  },
  {
    id: 3,
    name: "binod",
    points: 0,
    old_rank: 2,
    current_rank: 3,
  },
  {
    id: 4,
    name: "binod",
    points: 0,
    old_rank: 2,
    current_rank: 3,
  },
  {
    id: 5,
    name: "binod",
    points: 0,
    old_rank: 2,
    current_rank: 3,
  },
  {
    id: 6,
    name: "binod",
    points: 0,
    old_rank: 2,
    current_rank: 3,
  },
  {
    id: 7,
    name: "binod",
    points: 0,
    old_rank: 2,
    current_rank: 3,
  },
  {
    id: 8,
    name: "binod",
    points: 0,
    old_rank: 2,
    current_rank: 3,
  },
  {
    id: 10,
    name: "binod",
    points: 0,
    old_rank: 2,
    current_rank: 3,
  },
  {
    id: 18,
    name: "23",
    points: 0,
    old_rank: 2,
    current_rank: 3,
  },
  {
    id: 19,
    name: "43",
    points: 0,
    old_rank: 2,
    current_rank: 3,
  },
  {
    id: 20,
    name: "21",
    points: 0,
    old_rank: 2,
    current_rank: 3,
  },
];

const users = [
  {
    id: 1,
    name: "binod",
    email: "1@iitbbs.ac.in",
    role: "user",
    designation: "core",
    old_rank: 2,
    current_rank: 1,
    points: 60,
    allotedPoints: [
      {
        id: 11,
        user_id: 1,
        timestamp: "1597490130605.0",
        points_awarded: 60,
        reason: "hume tumhari binodata kafi pasand hai",
        awarded_by: 11,
        name: "binod Super",
        email: "12@iitbbs.ac.in",
        role: "superAdmin",
        designation: "core",
        old_rank: "",
        current_rank: "",
        points: 0,
        tracking_points: 0,
        blacklisted: 0,
        password:
          "$2a$12$HyRXPgvXoMP.jkC7YszRoO11QEMXzd1XXDUINhk.0i8kxOZO7.1KS",
        reset_token: null,
        bio: "Log meri binodata se kaafi prabhavit hai",
        reset_token_expires_at: null,
      },
    ],
  },
  {
    id: 3,
    name: "binod",
    email: "3@iitbbs.ac.in",
    role: "user",
    designation: "core",
    old_rank: 2,
    current_rank: 3,
    points: 0,
    allotedPoints: null,
  },
  {
    id: 4,
    name: "binod",
    email: "4@iitbbs.ac.in",
    role: "user",
    designation: "core",
    old_rank: 2,
    current_rank: 3,
    points: 0,
    allotedPoints: null,
  },
  {
    id: 5,
    name: "binod",
    email: "5@iitbbs.ac.in",
    role: "user",
    designation: "core",
    old_rank: 2,
    current_rank: 3,
    points: 0,
    allotedPoints: null,
  },
  {
    id: 6,
    name: "binod",
    email: "6@iitbbs.ac.in",
    role: "user",
    designation: "core",
    old_rank: 2,
    current_rank: 3,
    points: 0,
    allotedPoints: null,
  },
  {
    id: 7,
    name: "binod",
    email: "7@iitbbs.ac.in",
    role: "user",
    designation: "core",
    old_rank: 2,
    current_rank: 3,
    points: 0,
    allotedPoints: null,
  },
  {
    id: 8,
    name: "binod",
    email: "8@iitbbs.ac.in",
    role: "user",
    designation: "core",
    old_rank: 2,
    current_rank: 3,
    points: 0,
    allotedPoints: null,
  },
  {
    id: 9,
    name: "binod",
    email: "9@iitbbs.ac.in",
    role: "admin",
    designation: "Sr.Associate",
    old_rank: 1,
    current_rank: 2,
    points: 30,
    allotedPoints: [
      {
        id: 11,
        user_id: 9,
        timestamp: "1597490130605.0",
        points_awarded: 30,
        reason: "hume tumhari binodata kafi pasand hai",
        awarded_by: 11,
        name: "binod Super",
        email: "12@iitbbs.ac.in",
        role: "superAdmin",
        designation: "core",
        old_rank: "",
        current_rank: "",
        points: 0,
        tracking_points: 0,
        blacklisted: 0,
        password:
          "$2a$12$HyRXPgvXoMP.jkC7YszRoO11QEMXzd1XXDUINhk.0i8kxOZO7.1KS",
        reset_token: null,
        bio: "Log meri binodata se kaafi prabhavit hai",
        reset_token_expires_at: null,
      },
    ],
  },
  {
    id: 10,
    name: "binod",
    email: "10@iitbbs.ac.in",
    role: "user",
    designation: "core",
    old_rank: 2,
    current_rank: 3,
    points: 0,
    allotedPoints: null,
  },
  {
    id: 18,
    name: "23",
    email: "23@iitbbs.ac.in",
    role: "user",
    designation: null,
    old_rank: 2,
    current_rank: 3,
    points: 0,
    allotedPoints: null,
  },
  {
    id: 19,
    name: "43",
    email: "43@iitbbs.ac.in",
    role: "user",
    designation: null,
    old_rank: 2,
    current_rank: 3,
    points: 0,
    allotedPoints: null,
  },
  {
    id: 20,
    name: "21",
    email: "21@iitbbs.ac.in",
    role: "user",
    designation: null,
    old_rank: 2,
    current_rank: 3,
    points: 0,
    allotedPoints: null,
  },
];

exports.generateReport = async (users, entries) => {
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
      path.join(__dirname, "biweekly-report-template.ejs"),
      {
        entries: entries,
        users: users,
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
              }
            });
        }
      }
    );
  } catch (err) {
    throw err;
  }
};
