const Koa = require('koa');
const path = require('path');
// 静态资源管理
const static = require('koa-static');
// 路由
const Router = require('koa-router');
// 验证token
const utils = require('./utils/utils');
// 接受post请求参数
const bodyParser = require('koa-bodyparser');
// 接受文件的包
const koaBody = require('koa-body');
// koa-jwt
const koaJwt = require('koa-jwt');
// 跨域
const koa2Cors = require('koa2-cors');

// 获取koa实例
const app = new Koa();
/***** 中间件 *****/
// 静态资源
app.use(static(path.join(__dirname, 'assets')));
// bodyparser
// app.use(bodyParser({multipart: true}));
// 接受文件
app.use(koaBody({
    multipart: true
}));
// jwt
app.use(koaJwt({
    secret: 'chandlerhouston'
}).unless({
    path: [/[^(login)]/] //数组中的路径不需要通过jwt验证
}));
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
// 通过token验证用户登录状态
app.use(utils.verifyToken);
app.use(router.routes());
/***** 监听1111端口 *****/
app.listen(1111, () => {
    console.log('http://localhost:1111');
});