const requestIp = require('request-ip');
const getCity = require('../utils/getCity');

module.exports = app => {
    app.use(async (ctx, next) => {
        ctx.state.ip = requestIp.getClientIp(ctx.req);
        ctx.state.city = await getCity(ctx.ip);
        await next();
    });
}