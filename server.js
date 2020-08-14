const app = require("./app");
const { PORT } = require("./utils/config");
require("./model/dbModel/database");
const comments = require("./comments/Comments.js");

const server = app.listen(PORT, () => {
  console.log(`server is running on ${PORT} ...`);
});

comments.setupSocket(server);
/**
 * 1. Require app       -done
 * 2. Set up server     -done
 * 3. Set up socket
 */
