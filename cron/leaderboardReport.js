const { fetchReportData } = require("../model/businessLogic/reportLogic");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendEmail");
const path = require("path");
const ejs = require("ejs");
const htmlPdf = require("html-pdf");
const cron = require("node-cron");

htmlToPdfBuffer = async (pathname, params) => {
  const html = await ejs.renderFile(pathname, params);
  return new Promise((resolve, reject) => {
    htmlPdf
      .create(html, { format: "A4", orientation: "portrait" })
      .toBuffer((err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
  });
};

const generateReport = async (req, res, next) => {
  try {
    const data = await fetchReportData(next);

    const pathView = path.join(__dirname, "../utils/views/leaderboard.ejs");
    const htmlPathview = path.join(__dirname, "../utils/views/report.ejs");
    const emailTemplate = await ejs.renderFile(htmlPathview);

    const fileBuffer = await htmlToPdfBuffer(pathView, {
      entries: data.leaderboard,
      users: data.changes,
    });

    const d = new Date();
    const fileDate = d.toLocaleDateString();
    const fileName = `BiWeekly_Report_${fileDate}.pdf`;

    try {
      sendEmail({
        email: data.emails,
        subject: "Bi-Weekly Report",
        message:
          "Dear Admins and Super Admins Please find Attached the Bi-weekly Report of the Leader Board and Point Transactions of CMS Neuromancers",
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
  "0 6 * * Sun expr `date +%W` % 2 > /dev/null || /scripts/fortnightly.sh",
  async () => {
    await generateReport();
  }
);
