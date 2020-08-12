const app = require("./app");
const { PORT } = require("./utils/config");
require("./model/dbModel/database");

app.listen(PORT, () => {
  console.log(`server is running on ${PORT} ...`);
});

/**
 * 1. Require app       -done
 * 2. Set up server     -done
 * 3. Set up socket
 */
