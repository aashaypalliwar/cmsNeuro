const ejs = require("ejs");
const htmlPdf = require("html-pdf");

const htmlToPdfBuffer = async (pathname, params) => {
  const options = {
    format: "A4",
    orientation: "portrait",
    footer: {
      height: "28mm",
      contents: {
        default: `<span style="color: #444;">{{page}} | &copy; ${new Date().getFullYear()} Neuromancers, IITBBS </span>`,
      },
    },
  };

  const html = await ejs.renderFile(pathname, params);
  return new Promise((resolve, reject) => {
    htmlPdf.create(html, options).toBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
};

module.exports = htmlToPdfBuffer;
