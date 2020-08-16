const authLogic = require("../model/businessLogic/authLogic");

//utils
const AppError = require("../utils/appError");

// const {JWT_COOKIE_EXPIRES_IN} = require("../utils/config");

const createSendToken = async (user, statusCode, res) => {
  try {
    // console.log(user);
    const token = authLogic.signToken(user.id);
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
};

exports.protect = async (req, res, next) => {
  try {
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
    req.user = await authLogic.protect(token, next);
    next();
  } catch (err) {
    return next(err);
  }
};
exports.restrictTo = (...roles) => {
  return async (req, res, next) => {
    const id = req.user.id;
    const check = await authLogic.accessRestrict(id, roles, next);
    console.log(check);
    if (!check)
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );

    next();
  };
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }
    // 2) Check if user exists && password is correct
    const user = await authLogic.checkCredentials(email, password, next);

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    return next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    //take data from request
    const data = {
      id: req.user.id,
      currentPassword: req.body.password,
      newPassword: req.body.newPassword,
    };
    // if (true) return next(new AppError("Test went Wrong", 500));
    await authLogic.updatePassword(
      data.id,
      data.currentPassword,
      data.newPassword,
      next
    );

    createSendToken(req.user, 200, res);
  } catch (err) {
    return next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    //email from user
    const email = req.body.email;

    //send mail to the user
    await authLogic.forgotPassword(email, next);

    res.status(200).json({
      status: "success",
      message: "Token sent to mail",
    });
  } catch (err) {
    return next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    //take token and newPassword as input
    const { token, newPassword } = req.body;

    const user = await authLogic.resetPassword(token, newPassword, next);

    createSendToken(user, 200, res);
  } catch (err) {
    return next(err);
  }
};
