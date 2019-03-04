const koaBody = require('koa-body');
module.exports = async app => {
    app.use(koaBody());
}