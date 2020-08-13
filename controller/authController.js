const authLogic = require("../model/businessLogic/authLogic");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }
  req.user = authLogic.protect(token);
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    const id = req.user.id;

    if (!authLogic.accessRestrict(id, roles))
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );

    next();
  };
};
