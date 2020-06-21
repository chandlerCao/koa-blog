const Router = require('koa-router');
const CommentModel = require('../model/CommentModel');
const commentController = new Router();
// 创建文章模型
const commentmodel = new CommentModel();

// 评论列表
commentController.post('/comment/getCommentList', async ctx => {
    let { pagination = {}, params = {} } = ctx.request.body;

    const [
        searchValue,
        articleInfo,
        datePicker,
        currentPage,
        pageSize] = [
            params.searchValue || '',
            params.articleInfo || '',
            params.datePicker || [],
            pagination.currentPage || 1,
            pagination.pageSize || 10
        ]

    let start_date = datePicker[0] || '1970-01-01'
    let end_date = datePicker[1] || '2030-01-01'

    const commentList = await commentmodel.commentList(searchValue, articleInfo, start_date, end_date, (currentPage - 1) * pageSize, pageSize);

    const commentCount = await commentmodel.commentCount(searchValue, articleInfo, start_date, end_date);
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
// 删除评论
commentController.post('/comment/deleteComment', async ctx => {
    let { cid = [] } = ctx.request.body;
    if (Object.prototype.toString.call(cid) !== '[object Array]' || cid.length === 0) {
        ctx.body = {
            c: 1,
            m: '参数错误！'
        }
        return false
    }
    cid = cid.join(',')
    const res = await commentmodel.commentDel(cid);
    if (res.affectedRows) {
        ctx.body = {
            c: 0,
            m: '评论删除成功！'
        }
    } else {
        ctx.body = {
            c: 1,
            m: '评论删除失败！'
        }
    }
});
// 回复列表
commentController.post('/comment/getReplyList', async ctx => {
    let { pagination = {}, params = {} } = ctx.request.body;
    const [
        searchValue,
        commentInfo,
        articleInfo,
        datePicker,
        currentPage,
        pageSize] = [
            params.searchValue || '',
            params.commentInfo || '',
            params.articleInfo || '',
            params.datePicker || [],
            pagination.currentPage || 1,
            pagination.pageSize || 10
        ]

    let start_date = datePicker[0] || '1970-01-01'
    let end_date = datePicker[1] || '2030-01-01'

    const replyList = await commentmodel.replyList(searchValue, commentInfo, articleInfo, start_date, end_date, (currentPage - 1) * pageSize, pageSize);

    const replyCount = await commentmodel.replyCount(searchValue, commentInfo, articleInfo, start_date, end_date);
    ctx.body = {
        c: 0,
        d: {
            pagination: {
                total: replyCount.length,
                pageSize,
                currentPage
            },
            tableData: replyList
        }
    }
});
// 删除回复
commentController.post('/comment/deleteReply', async ctx => {
    let { rid = [] } = ctx.request.body;
    if (Object.prototype.toString.call(rid) !== '[object Array]' || rid.length === 0) {
        ctx.body = {
            c: 1,
            m: '参数错误！'
        }
        return false
    }
    rid = rid.join(',')
    const res = await commentmodel.replyDel(rid);
    if (res.affectedRows) {
        ctx.body = {
            c: 0,
            m: '回复删除成功！'
        }
    } else {
        ctx.body = {
            c: 1,
            m: '回复删除失败！'
        }
    }
});
module.exports = commentController;