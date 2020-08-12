const app = require('./app');
const config = require('./utils/config');

const PORT = config.PORT;

app.listen(PORT, () => {
    console.log(`server is running on ${PORT} ...`);
})

/**
 * 1. Require app       -done
 * 2. Set up server     -done
 * 3. Set up socket
 */
