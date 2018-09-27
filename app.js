const Koa = require('koa');
const path = require('path');
// 静态资源管理
const static = require('koa-static');
// 路由
const Router = require('koa-router');
// 验证token
const utils = require('./utils/utils');
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
app.use(static(path.join(__dirname, 'assets')));
// bodyparser
app.use(bodyParser({multipart: true}));

// jwt
app.use(koaJwt({
    secret: 'chandlerhouston'
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
    origin(ctx) {
        return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST'],
    allowHeaders: ['Content-Type', 'token', 'uid', 'Accept'],
}));

/***** 路由 *****/
const router = new Router();
/***** 前台路由 *****/
app.use(require('./index/controller').routes());
/***** 后台路由 *****/
// 管理员
const userRouter = require('./admin/controller/user');
// 文章
const adminArticleRouter = require('./admin/controller/article');
// 标签
const tagRouter = require('./admin/controller/tag');
/* 后台 */
router.use('/admin', tagRouter.routes());
router.use('/admin', adminArticleRouter.routes());
router.use('/user', userRouter.routes());
/* 前台 */
// 文章
const indexArticleRouter = require('./index/controller/index');
router.use('/index', indexArticleRouter.routes());
app.use(utils.verifyToken);
app.use(router.routes());
/***** 监听1111端口 *****/
app.listen(1111, () => {
    console.log('http://localhost:1111');
});