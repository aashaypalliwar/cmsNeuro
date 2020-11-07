const { fetchReportData } = require("./reportLogic");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendEmail");

exports.generateReport = async (req, res, next) => {
  try {
    const data = await fetchReportData(next);
    res.status(200).json({
      data,
    });
  } catch (err) {
    return next(err);
  }
};
