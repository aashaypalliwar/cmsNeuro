const jwt = require(`jsonwebtoken`);
const { promisify } = require("util");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

//utils
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../../utils/conig");
const sendEmail = require("../../utils/sendEmail");

const db = require("../dbModel/database");

//sign jwt
exports.signToken = (id) => {
  return jwt.sign({ id: id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

//verify jwt
const verifyJWT = catchAsync(async (token) => {
  return await promisify(jwt.verify)(token, JWT_SECRET);
});

//protect

exports.protect = catchAsync(async (token) => {
  const decoded = verifyJWT(token); //decode the jwt key, if error, handled in error handler

  //check if user exists

  const currentUser = await db.query(`SELECT * FROM users WHERE id=${decoded}`);
  if (!currentUser.data.length) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  // return the userData
  return currentUser.data[0];
});

//restrictTo,
exports.accessRestrict = catchAsync(async (id, roles) => {
  //1) find the role of the user
  const user = await db.query(`SELECT role FROM users WHERE id=${id}`);
  if (!user.data.length) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  const role = user.data[0].role;

  //check if roles include that
  if (!roles.includes(role)) return false;
  return true;
});

exports.checkCredentials = catchAsync(async (email, password) => {
  const currentUser = await db.query(`SELECT FROM users WHERE id=${id}`);
  //1) find the user
  if (!currentUser.data.length)
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );

  //2) check if the current password is correct
  if (!(await bcrypt.compare(currentPassword, currentUser.data[0].password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  return currentUser.data[0];
});

exports.updatePassword = catchAsync(
  async (id, currentPassword, newPassword) => {
    //1) find the user
    const currentUser = await db.query(
      `SELECT email,password FROM users WHERE id=${id}`
    );
    if (!currentUser.data.length)
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );

    //2) check if the current password is correct
    if (
      !(await bcrypt.compare(currentPassword, currentUser.data[0].password))
    ) {
      return next(new AppError("Your current password is wrong.", 401));
    }
    //hash the newPasword
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    //update it finally
    await db.query(
      `UPDATE users SET password='${hashedNewPassword}' where id=${id}`
    );
  }
);

exports.forgotPassword = catchAsync(async (email) => {
  //check if user exists
  const user = await db.query(`SELECT * FROM users WHERE email=${email}`);

  if (!user.data.length) {
    return next(new AppError("No user with that email", 404));
  }
  //generate a token
  const resetToken = crypto.randomBytes(32).toString("hex");

  //hash the token and make token expiry
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const resetTokenExpires = Date.now() + 10 * 60 * 1000;

  //save it database
  await db.query(
    `UPDATE users SET reset_token='${passwordResetToken}' reset_token_expires_at='${resetTokenExpires}' WHERE email=${email}`
  );

  //send an Email to the User

  const message = `Forgot your password? \n Paste this Code on your screen and enter your New Password.\n If you didn't forget your password, please ignore this email!\n  ${resetToken} \n `;

  //if succesfull then goes back to main function else erase the reset token and expiry from database
  try {
    await sendEmail({
      email,
      subject: "Your Password Reset Token {Valid for 10 min}",
      message,
    });
  } catch (err) {
    await db.query(
      `UPDATE users SET reset_token=NULL reset_token_expires_at=NULL WHERE email=${email}`
    );

    return next(new AppError("There was an error sending email"), 500);
  }
});

exports.resetPassword = catchAsync(async (token, newPassword) => {
  //find user on thebasis of hashed token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await db.query(
    `SELECT * FROM users WHERE reset_token=${hashedToken} AND datetime('now)< reset_token_expires_at`
  );

  if (!user.data.length)
    return next(
      new AppError("No user found, Token is Invalid or expired"),
      403
    );

  //hash the newPassword
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  //update the database
  await db.query(
    `UPDATE users SET password='${hashedNewPassword}' WHERE id=${user.data[0].id}`
  );

  return user;
});

exports.bulkSignup = catchAsync(async (emails) => {
  //array of emails
  emails.map(async (email) => {
    //Generate a random OTP and hash it using bcrpyt
    const OTP = String(Math.floor(Math.random() * 1000 + 1));
    const tempPassword = await bcrypt.hash(OTP, 12);

    const tempName = email.split("@")[0]; //temp name the email characters  e.g dsp13

    const timestamp = Date.now(); //timestamp
    const queryParams = [tempName, email, "user", timestamp, tempPassword];

    //insert into database
    await db.query(
      `INSERT INTO users (name, email, role,timestamp, password) VALUES (?, ?, ?,?,?)`,
      queryParams
    );
    //Message
    const message = `Dear ${tempName}, \n You are added to the Neuromancers Society\n The tasks and leaderboard will be on this temp.com.\n Login to the page using your college email id and this OTP, change the password after this login.\n \n ${OTP} `;
    //sendEmail
    try {
      sendEmail({
        email,
        subject: "Welcome to Neuromancers",
        message,
      });
    } catch (err) {
      console.log(err.message);
      return next(new AppError("There was an error sending email", 500));
    }
  });
});
