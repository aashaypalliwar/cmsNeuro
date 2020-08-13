const jwt = require(`jsonwebtoken`);
const AppError = require("../../utils/appError");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../../utils/conig");
const db = require("../dbModel/database");
const catchAsync = require("../../utils/catchAsync");
const { promisify } = require("util");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmail");

//sign jwt
const signToken = (id) => {
  return jwt.sign({ id: id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

//verify jwt
const verifyJWT = catchAsync(async (token) => {
  return await promisify(jwt.verify)(token, JWT_SECRET);
});

//protect,

exports.protect = catchAsync(async (token) => {
  const decoded = verifyJWT(token);
  const currentUser = await db.query(`SELECT * FROM users WHERE id=${decoded}`);
  if (!currentUser.data.length) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  return currentUser.data[0];
});

//restrictTo,
exports.accessRestrict = (id,roles) => {
    const user = await db.query(`SELECT role FROM users WHERE id=${id}`);
    const role = user.data[0].role;
    if (!roles.includes(role)) return false
    return true;
  };


