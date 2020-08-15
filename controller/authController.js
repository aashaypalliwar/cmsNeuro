const authLogic = require("../model/businessLogic/authLogic");

//utils
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// const {JWT_COOKIE_EXPIRES_IN} = require("../utils/config");

const createSendToken = async(user, statusCode, res) => {
  try {
    console.log(user);
    const token = await authLogic.signToken(user.id);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
  } catch (error) {
    console.log(error);
  }
} 

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

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await authLogic.checkCredentials(email, password);

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //take data from request
  const data = {
    id: req.user.id,
    currentPassword: req.body.password,
    newPassword: req.body.newPassword,
  };

  await authLogic.updatePassword(
    data.id,
    data.currentPassword,
    data.newPassword
  );

  createSendToken(req.user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //email from user
  const email = req.body.email;

  //send mail to the user
  await authLogic.forgotPassword(email);

  res.status(200).json({
    status: "success",
    message: "Token sent to mail",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //take token and newPassword as input
  const { token, newPassword } = req.body;

  const user = await authLogic.resetPassword(token, newPassword);

  createSendToken(user, 200, res);
});

exports.bulkSignup = catchAsync(async (req, res, next) => {
  //emails sepearted by commas
  const emails = req.body.emails.split(",");

  await authLogic.bulkSignup(emails);

  res.status(200).json({
    success,
    message: "Users successfully signed up",
  });
});
