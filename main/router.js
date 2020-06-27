const Router = require('koa-router');
module.exports = app => {
    const router = new Router();
    router.get('/admin', ctx => {
        ctx.type = 'html';
        ctx.body = require('fs').createReadStream(require('path').resolve(`${ctx.state.root_dir}/admin/view/index.html`));
    });
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
    const message_router = require('../admin/controller/message');
    router.use('/backend', user_router.routes(), require('../middleware/token').decodeToken, article_router.routes(), tag_router.routes(), comment_router.routes(), message_router.routes());
    app.use(router.routes()).use(router.allowedMethods());
}