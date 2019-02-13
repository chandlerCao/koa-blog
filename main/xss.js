module.exports = app => {
    app.use(async (ctx, next) => {
        ctx.body = ctx.state.xss(JSON.stringify(ctx.body));
        await next();
    });
}