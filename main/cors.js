const koa2Core = require('koa2-cors');
module.exports = app => {
    app.use(koa2Core({
        origin(ctx) {
            return '*';
        },
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
        maxAge: 5,
        credentials: true,
        allowMethods: ['GET', 'POST'],
        allowHeaders: ['Content-Type', 'token', 'Accept', 'x-forwarded-for']
    }));
}