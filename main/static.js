const path = require('path');
const static = require('koa-static');
const config = require('../config');
module.exports = app => {
    app.use(static(path.join(config.root_dir, 'assets'))).use(static(path.join(config.root_dir, 'index/view'))).use(static(path.join(config.root_dir, 'admin/view')));
}