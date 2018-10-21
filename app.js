const Koa = require('koa');
// 获取koa实例
const app = new Koa();

/***** 中间件 *****/
// 静态资源
const static = require('koa-static');
const path = require('path');
app.use(static(path.join(__dirname, 'assets')));
// koa-body
const koaBody = require('koa-body');
app.use(koaBody({
    multipart: true
}));
// 跨域
const koa2Cors = require('koa2-cors');
app.use(koa2Cors({
    origin(ctx) {
        return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST'],
    allowHeaders: ['Content-Type', 'token', 'Accept', 'x-forwarded-for']
}));
/***** 路由 *****/
const Router = require('koa-router');
const router = new Router();
// 前台路由
const indexArticleRouter = require('./index/controller/index');
router.use('/index', indexArticleRouter.routes());
// 后台路由
// 文章
const article_router = require('./admin/controller/article');
// 标签
const tag_router = require('./admin/controller/tag');
// 管理员
const user_router = require('./admin/controller/user');
router.use('/admin', article_router.routes(), tag_router.routes(), user_router.routes());
// token验证用户登录状态
const decodeToken = require('./middleware/token').decodeToken;
app
    .use(decodeToken)
    .use(router.routes())
    .use(router.allowedMethods());
/***** 监听1111端口 *****/
app.listen(1111, () => {
    console.log('http://localhost:1111');
});