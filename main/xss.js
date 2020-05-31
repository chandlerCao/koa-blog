const xss = require('xss');
module.exports = app => {
    app.use(async (ctx, next) => {
        ctx.body = xss(JSON.stringify(ctx.body));
        await next();
    });
}