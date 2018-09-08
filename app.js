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
// 跨域
const koa2Cors = require('koa2-cors');

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
    key: 'koa:sess',
    maxAge: 100000000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false
};
app.use(session(sessionConfig, app));
// 跨域
app.use(koa2Cors({
    origin: function (ctx) {
        if (ctx.url === '/test') {
            return false;
        }
        return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
/***** 路由 *****/
// 主页
app.use(require('./admin/controller').routes());
// 相册
app.use(require('./admin/controller/photo').routes());
// 相册
app.use(require('./admin/controller/article').routes());
/***** 监听8001端口 *****/
app.listen(8001, () => {
    console.log('http://localhost:8001');
});