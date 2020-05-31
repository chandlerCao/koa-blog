const http = require('http');
const https = require('https');
const fs = require('fs');
const config = require('../config');

module.exports = app => {
    http.createServer({}, app.callback()).listen(config.address.http.port, () => {
        console.log(`the http server running at ${config.address.http.host}`);
    });
    try {
        https.createServer({
            key: fs.readFileSync('/software/nginx-1.15.7/conf/1844797_blog.caodj.cn.key'),
            cert: fs.readFileSync('/software/nginx-1.15.7/conf/1844797_blog.caodj.cn.pem')
        }, app.callback()).listen(config.address.https.port, '0.0.0.0', () => {
            console.log(`the http server running at ${config.address.https.host}`);
        });
    } catch (error) {
        https.createServer(app.callback()).listen(config.address.https.port, '0.0.0.0', () => {
            console.log(`the http server running at ${config.address.https.host}`);
        });
    }
}