const http = require('http');
const https = require('https');
const config = require('../config');
module.exports = app => {
    http.createServer({}, app.callback()).listen(config.address.http.port, '0.0.0.0', () => {
        console.log(`the http server running at ${config.address.http.host()}`);
    });
    https.createServer({}, app.callback()).listen(config.address.https.port, '0.0.0.0', () => {
        console.log(`the http server running at ${config.address.https.host()}`);
    });
}