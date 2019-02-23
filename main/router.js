const Router = require('koa-router');
module.exports = app => {
    const router = new Router();
    /* 前台路由 */
    const ArticleRouter = require('../index/controller/article');
    const CommentRouter = require('../index/controller/comment');
    const MessageRouter = require('../index/controller/message');
    router.use('/index/article', ArticleRouter.routes());
    router.use('/index/comment', CommentRouter.routes());
    router.use('/index/message', MessageRouter.routes());

    /* 后台路由 */
    // 文章
    const article_router = require('../admin/controller/article');
    // 标签
    const tag_router = require('../admin/controller/tag');
    // 用户
    const user_router = require('../admin/controller/user');
    router.use('/admin', article_router.routes(), tag_router.routes(), user_router.routes());
    app.use(router.routes()).use(router.allowedMethods())
}