const app = require("./app");
const comments = require("./comments/Comments.js");
const { PORT } = require("./utils/config");
require("./model/dbModel/database");

const server = app.listen(PORT, () => {
  console.log(`server is running on ${PORT} ...`);
});

//Set up socket for comments
comments.setupSocket(server);

