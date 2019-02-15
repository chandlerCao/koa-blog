const requestIp = require('request-ip');
module.exports = app => {
    app.use(async (ctx, next) => {
        ctx.state.ip = requestIp.getClientIp(ctx.req);
        await next();
    });
}