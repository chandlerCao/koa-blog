module.exports = app => {
    app.use(async ctx => {
        ctx.body = ctx.state.xss(JSON.stringify(ctx.body));
    });
}