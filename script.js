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

        const queryParams = [name,email,role,timeStamp,hashedPassword,"core"];

        await db.query(
            `INSERT INTO users (name, email, role, timestamp, password, designation) VALUES ($1,$2,$3,$4,$5,$6)`,
            queryParams
          );
          console.log(i+1);
        
    }
    console.log("Hello World");
    } catch (error) {
       console.log(error); 
    }
    res.status(200).json({
      message: "Secy Added Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
