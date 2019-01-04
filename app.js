const Koa = require('koa');
const app = new Koa();
// 配置
const config = require('./config');

// 静态资源
const static = require('koa-static');
const path = require('path');
app.use(static(path.join(__dirname, 'assets')));
app.use(static(path.join(__dirname, 'index/view/blog')));
// koa-body
const koaBody = require('koa-body');
app.use(koaBody({
    multipart: true
}));
// cookie
// 跨域
app.use(require('koa2-cors')({
    origin(ctx) {
        return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST'],
    allowHeaders: ['Content-Type', 'token', 'Accept', 'x-forwarded-for']
}));
/***** 挂载自定义属性 *****/
app.context.domain = config.address.domain;
app.context.port = config.address.port;
app.context.icon_dir = config.tag_icon_dir;
app.context.static_dir = config.static_dir;
app.context.articleLen = config.articleLen;
app.context.xss = require("xss");
/***** 挂载自定义属性 *****/
/***** 路由 *****/
const Router = require('koa-router');
const router = new Router();
// 前台路由
const indexArticleRouter = require('./index/controller/index');
router.use('/', indexArticleRouter.routes());
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
    // .use(decodeToken)
    .use(router.routes())
    .use(router.allowedMethods())
    .use(async ctx => {
        ctx.body = ctx.xss(JSON.stringify(ctx.body));
    });
/***** 监听1111端口 *****/
app.listen(config.address.port, '0.0.0.0', () => {
    console.log(`${config.address.domain}:${config.address.port}`);
});