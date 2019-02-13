const config = require('../config');
module.exports = app => {
    app.listen(config.address.port, '0.0.0.0', () => {
        console.log(`the server running at ${config.address.host()}`);
    });
}