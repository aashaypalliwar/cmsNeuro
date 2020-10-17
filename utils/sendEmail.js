const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: "CMS Neuro <deshmukhshrirang03@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
    attachments: options.attachments,
  };

  await transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendEmail;

//For production using SendGrid

//   if (process.env.NODE_ENV === "production") {
//     transport = nodemailer.createTransport({
//       service: "SendGrid",
//       auth: {
//         user: process.env.SENDGRID_USERNAME,
//         pass: process.env.SENDGRID_PASSWORD,
//       },
//     });
