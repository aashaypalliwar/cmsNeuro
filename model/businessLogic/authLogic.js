const jwt = require(`jsonwebtoken`);
const { promisify } = require("util");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const path = require("path");
const ejs = require("ejs");

//utils
const AppError = require("../../utils/appError");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("./../../utils/config");
const sendEmail = require("./../../utils/sendEmail");

const db = require("../dbModel/database");

//sign jwt
exports.signToken = (id) => {
  // console.log(process.env.PORT);
  return jwt.sign({ id: id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

//verify jwt
const verifyJWT = async (token, next) => {
  try {
    return await promisify(jwt.verify)(token, JWT_SECRET);
  } catch (err) {
    throw new AppError("Error in verifying token", 500);
  }
};

//protect

exports.protect = async (token, next) => {
  try {
    const decoded = await verifyJWT(token); //decode the jwt key, if error, handled in error handler

    //check if user exists
    if (!decoded) throw new AppError("Your Password or email is Wrong");

    const currentUser = await db.query(
      `SELECT * FROM users WHERE id=${decoded.id}`
    );
    if (!currentUser.data.length) {
      throw new AppError(
        "The user belonging to this token does no longer exist.",
        401
      );
    }
    // return the userData
    return currentUser.data[0];
  } catch (err) {
    throw err;
  }
};

//restrictTo,
exports.accessRestrict = async (id, roles, next) => {
  try {
    //1) find the role of the user
    const user = await db.query(`SELECT role FROM users WHERE id=${id}`);
    if (!user.data.length) {
      throw new AppError(
        "The user belonging to this token does no longer exist.",
        401
      );
    }
    const role = user.data[0].role;

    //check if roles include that
    return roles.includes(role);
  } catch (err) {
    throw err;
  }
};

exports.checkCredentials = async (email, password, next) => {
  try {
    const currentUser = await db.query(
      `SELECT * FROM users WHERE email='${email}'`
    );
    //1) find the user
    if (!currentUser.data.length)
      throw new AppError("Your email or password is wrong.", 401);

    //2) check if the current password is correct
    if (!(await bcrypt.compare(password, currentUser.data[0].password))) {
      throw new AppError("Your email or password is wrong.", 401);
    }

    return currentUser.data[0];
  } catch (err) {
    throw err;
  }
};
exports.updatePassword = async (id, currentPassword, newPassword, next) => {
  try {
    //1) find the user
    const currentUser = await db.query(
      `SELECT email,password FROM users WHERE id=${id}`
    );
    if (!currentUser.data.length)
      throw new AppError(
        "The user belonging to this token does no longer exist.",
        401
      );

    //2) check if the current password is correct
    const check = await bcrypt.compare(
      currentPassword,
      currentUser.data[0].password
    );
    if (!check) {
      throw new AppError("Your current password is wrong.", 401);
    }
    //hash the newPasword
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    //update it finally
    await db.query(
      `UPDATE users SET password='${hashedNewPassword}' where id=${id}`
    );
  } catch (err) {
    throw err;
  }
};

exports.forgotPassword = async (email, next) => {
  try {
    //check if user exists
    const user = await db.query(`SELECT * FROM users WHERE email='${email}'`);
    if (!user.data.length) {
      throw new AppError("No user with that email", 404);
    }
    //generate a token
    // const resetToken = crypto.randomBytes(32).toString("hex");
    //Four digit OTP
    const resetToken = String(Math.floor(Math.random() * 10000 + 1));

    //hash the token and make token expiry
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const resetTokenExpires = Date.now() + 10 * 60 * 1000;

    // console.log(resetTokenExpires);
    //save it database
    await db.query(
      `UPDATE users SET reset_token='${passwordResetToken}', reset_token_expires_at='${resetTokenExpires}' WHERE email='${email}'`
    );

    //send an Email to the User

    const message = `Dear ${user.data[0].name}, \n Forgot your password? \n Paste this Code on your screen and enter your New Password.\n If you didn't forget your password, please ignore this email! \n${resetToken} \n Regards \n Secretary \n Neuromancers `;

    //if succesfull then goes back to main function else erase the reset token and expiry from database
    const pathView = path.join(__dirname, "../../utils/views/forgot.ejs");
    console.log(pathView);
    const emailTemplate = await ejs.renderFile(pathView, {
      name: user.data[0].name,
      OTP: resetToken,
    });

    try {
      await sendEmail({
        email,
        subject: "Your Password Reset Token {Valid for 10 min}",
        message,
        html: emailTemplate,
      });
    } catch (err) {
      await db.query(
        `UPDATE users SET reset_token=NULL reset_token_expires_at=NULL WHERE email=${email}`
      );

      throw new AppError("There was an error sending email", 500);
    }
  } catch (err) {
    throw err;
  }
};

exports.resetPassword = async (token, newPassword, next) => {
  try {
    //find user on thebasis of hashed token
    // console.log(token);
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    // console.log(hashedToken);
    const user = await db.query(
      `SELECT * FROM users WHERE reset_token='${hashedToken}'`
    );

    if (!user.data.length)
      throw new AppError("No user found, Token is Invalid or expired", 403);

    //hash the newPassword
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    //update the database
    await db.query(
      `UPDATE users SET password='${hashedNewPassword}' WHERE id=${user.data[0].id}`
    );

    return user.data[0];
  } catch (err) {
    throw err;
  }
};
