//Getting the port being used from config file
const { PORT } = require("./utils/config");
const comments = require("./comments/Comments.js");

//HANDLILNG UNCAUGHT EXCEPTION!
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

//requiring app file
const app = require("./app");
//CONNECT TO DATABASE
require("./model/dbModel/database");

//Starting the server
const server = app.listen(PORT, () => {
  console.log(`server is running on ${PORT} ...`);
});

//Set up socket for comments
comments.setupSocket(server);

//HANDLILNG UNCAUGHT REJECTION!
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
