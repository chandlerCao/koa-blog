const xss = require('xss');
const config = require('../config');
const getCity = require('../utils/getCity');
module.exports = app => {
    app.use(async (ctx, next) => {
        ctx.state.icon_dir = config.tag_icon_dir;
        ctx.state.static_dir = config.static_dir;
        ctx.state.test_dir = config.test_dir;
        ctx.state.myHost = config.address.host();
        ctx.state.dirname = config.dirname;
        ctx.state.getCity = getCity;
        ctx.state.xss = xss;
        await next();
    });
}