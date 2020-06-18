const Router = require('koa-router');
const CommentModel = require('../model/CommentModel');
const commentController = new Router();
const adminConfig = require('../admin.config');
// 创建文章模型
const commentmodel = new CommentModel();

// 评论列表
commentController.post('/comment/getCommentList', async ctx => {
    let { pagination = {}, params = {} } = ctx.request.body;

    const [
        searchValue,
        datePicker,
        currentPage,
        pageSize] = [
            params.searchValue || '',
            params.datePicker || [],
            pagination.currentPage || 1,
            pagination.pageSize || 10
        ]

    let start_date = datePicker[0] || '1970-01-01'
    let end_date = datePicker[1] || '2030-01-01'

    const commentList = await commentmodel.commentList(searchValue, start_date, end_date, (currentPage - 1) * pageSize, pageSize);

    const commentCount = await commentmodel.commentCount(searchValue, start_date, end_date);
    ctx.body = {
        c: 0,
        d: {
            pagination: {
                total: commentCount.length,
                pageSize,
                currentPage
            },
            tableData: commentList
        }
    }
});
// 评论总数
commentController.get('/comment/getCommentCount', async (ctx, next) => {
    const commentCountRes = await commentModel.getCommentCount();
    ctx.body = {
        c: 0,
        d: { total: commentCountRes[0].commentCount }
    }
    await next();
});
// 删除评论
commentController.post('/comment/commentDel', async (ctx, next) => {
    let { cids } = ctx.request.body;
    cids = Object.prototype.toString.call(cids) === '[object Array]' ? cids : [];
    if (!cids.length) {
        ctx.body = { c: 1, m: '请传递正确的评论id！' };
        return false;
    }
    const delCommentRes = await commentModel.commentDel(cids);
    if (delCommentRes.affectedRows) ctx.body = { c: 0, m: '删除成功！' };
    else ctx.body = { c: 1, m: '删除失败！' };
    await next();
});

// 回复列表
commentController.get('/comment/getReplyList', async (ctx, next) => {
    let { cid, page } = ctx.query;
    page = (page < 1 || isNaN(page)) ? 1 : page;
    // 获取回复列表
    const replyList = await commentModel.getReplyList(cid, (page - 1) * adminConfig.ReplyLimit, adminConfig.ReplyLimit);
    ctx.body = {
        c: 0,
        d: {
            replyList,
            pageSize: adminConfig.ReplyLimit
        }
    }
    await next();
});
// 回复总数
commentController.get('/comment/getReplyCount', async (ctx, next) => {
    let { cid } = ctx.query;
    const replyCountRes = await commentModel.getReplyCount(cid);
    ctx.body = {
        c: 0,
        d: { total: replyCountRes[0].replyCount }
    }
    await next();
});
// 删除回复
commentController.post('/comment/replyDel', async (ctx, next) => {
    let { rids } = ctx.request.body;
    rids = Object.prototype.toString.call(rids) === '[object Array]' ? rids : [];
    if (!rids.length) {
        ctx.body = { c: 1, m: '请传递正确的回复id！' };
        return false;
    }
    const delReplyRes = await commentModel.replyDel(rids);
    if (delReplyRes.affectedRows) ctx.body = { c: 0, m: '删除成功！' };
    else ctx.body = { c: 1, m: '删除失败！' };
    await next();
});
module.exports = commentController;