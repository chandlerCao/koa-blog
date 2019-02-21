const http = require('http');
const https = require('https');
const config = require('../config');
module.exports = app => {
    http.createServer(app.callback()).listen(3001, () => {
        console.log(`the http server running at http://localhost:3001`);
    });
    https.createServer(app.callback()).listen(config.address.port, () => {
        console.log(`the https server running at ${config.address.host()}`);
    });
}