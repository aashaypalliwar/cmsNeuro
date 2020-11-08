const path = require("path");
const ejs = require("ejs");
const cron = require("node-cron");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendEmail");
const htmlToPdfBuffer = require("../utils/htmlToPdfBuffer");
const { fetchReportData } = require("../model/businessLogic/reportLogic");

const generateReport = async (req, res, next) => {
  try {
    const data = await fetchReportData(next);

    const pathView = path.join(
      __dirname,
      "../utils/views/leaderboardReport.ejs"
    );
    const htmlPathview = path.join(__dirname, "../utils/views/report.ejs");
    const message = `Please find Attached the Bi-weekly Report of the Leader Board and Point Transactions of CMS Neuromancers`;
    const emailTemplate = await ejs.renderFile(htmlPathview, {
      message: message,
    });

    const fileBuffer = await htmlToPdfBuffer(pathView, {
      entries: data.leaderboard,
      users: data.changes,
    });

    const d = new Date();
    const fileName = `BiWeekly_Report_${d.toLocaleDateString()}.pdf`;

    try {
      sendEmail({
        email: data.emails,
        subject: "Bi-Weekly Report",
        message: message,
        html: emailTemplate,
        attachments: { filename: fileName, content: fileBuffer },
      });
    } catch (err) {
      console.log(err.message);
      throw new AppError("There was an error sending email", 500);
    }

    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    return err;
  }
};

//Every Second Sunday
exports.cronJob = cron.schedule(
  "* * * * * *",
  async () => {
    await generateReport();
  },
  { scheduled: false }
);
