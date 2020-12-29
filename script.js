//This file was written only to autenticate users using fake emails bulkly

const bcrypt = require("bcryptjs");
const db = require("./model/dbModel/database");

exports.secySignup = async (req, res, next) => {
  try {
    for (i = 0; i < 7; i++) {
      const name = `Dummy User ${i}`;
      const role = "user";
      const password = "CMS_Neuro";
      const email = `${i}@iitbbs.ac.in`;
      const hashedPassword = await bcrypt.hash(password, 12);
      const timeStamp = Date.now();
      const designation = "Dummy";

      const queryParams = [
        name,
        email,
        role,
        timeStamp,
        hashedPassword,
        designation,
      ];

      await db.query(
        `INSERT INTO users (name, email, role,timestamp, password,designation) VALUES (?, ?, ?,?,?,?)`,
        queryParams
      );
    }
    res.status(200).json({
      message: "Secy Added Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
