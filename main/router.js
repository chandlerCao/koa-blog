const Router = require('koa-router');
module.exports = app => {
    const router = new Router();
    /* 前台路由 */
    const ArticleRouter = require('../index/controller/article');
    const CommentRouter = require('../index/controller/comment');
    const MessageRouter = require('../index/controller/message');
    router.use('/index', ArticleRouter.routes(), CommentRouter.routes(), MessageRouter.routes());
    /* 后台路由 */
    const article_router = require('../admin/controller/article');
    const tag_router = require('../admin/controller/tag');
    const user_router = require('../admin/controller/user');
    const comment_router = require('../admin/controller/comment');
    // token
    router.use('/admin', user_router.routes(), /* require('../middleware/token').decodeToken, */ article_router.routes(), tag_router.routes(), comment_router.routes());
    app.use(router.routes()).use(router.allowedMethods());
}