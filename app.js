const Koa = require('koa');
const path = require('path');
// 静态资源管理
const static = require('koa-static');
// 路由
const router = require('koa-router');
// nunjucks 模板引擎
const koaNunjucks = require('koa-nunjucks-2');
// 接受post请求参数
const bodyParser = require('koa-bodyparser');
// koa-jwt
const koaJwt = require('koa-jwt');
// 会话session
const session = require('koa-session');

// 获取koa实例
const app = new Koa();
/***** 中间件 *****/
// 静态资源
app.use(static(path.join(__dirname, 'index/public')));
// bodyparser
app.use(bodyParser({multipart: true}));
// jwt
app.use(koaJwt({
    secret: 'learn jwt demo'
}).unless({
    path: [/[^(login)]/] //数组中的路径不需要通过jwt验证
}));
// 模板引擎
app.use(koaNunjucks({
    ext: 'html',
    path: path.join(__dirname, 'index/views'),
    nunjucksConfig: {
        trimBlocks: false,
        noCache: true
    }
}));
// session
app.keys = ['ChandlerHouston'];
const sessionConfig = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 100000000, // one day ms
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(session(sessionConfig, app));
/***** 路由 *****/
// 主页
app.use(require('./admin/controller').routes());
// 相册
app.use(require('./admin/controller/photo').routes());
/***** 监听8001端口 *****/
app.listen(8001, () => {
    console.log('localhost:8001');
});