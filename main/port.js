const http = require('http');
const https = require('https');
const config = require('../config');
module.exports = app => {
    https.createServer(app.callback()).listen(8080, () => {
        console.log(`the https server running at https://localhost:8080`);
    });
}