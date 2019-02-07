const path = require('path');
const static = require('koa-static');
const config = require('../config');
module.exports = app => {
    app.use(static(path.join(config.dirname, 'assets')));
    app.use(static(path.join(config.dirname, 'index/view')));
}