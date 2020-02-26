const Router = require('koa-router');
const MessageModel = require('../model/MessageModel');
const messageController = new Router();
const adminConfig = require('../admin.config');
// 创建留言模型
const messageModel = new MessageModel();

// 留言列表
messageController.get('/message/getMessageList', async (ctx, next) => {
    let { page } = ctx.query;
    page = Number(page);
    page = (page < 1 || isNaN(page)) ? 1 : page;
    // 留言列表
    const messageList = await messageModel.getMessageList((page - 1) * adminConfig.MessageLimit, adminConfig.MessageLimit);
    ctx.body = {
        c: 0,
        d: {
            messageList,
            pageSize: adminConfig.MessageLimit
        }
    }
    await next();
});
// 留言总数
messageController.get('/message/getMessageCount', async (ctx, next) => {
    const messageCountRes = await messageModel.getMessageCount();
    ctx.body = {
        c: 0,
        d: { total: messageCountRes[0].messageCount }
    }
    await next();
});
// 删除留言
messageController.post('/message/messageDel', async (ctx, next) => {
    let { mids } = ctx.request.body;
    mids = Object.prototype.toString.call(mids) === '[object Array]' ? mids : [];
    if (!mids.length) {
        ctx.body = { c: 1, m: '请传递正确的留言id！' };
        return false;
    }
    const delMessageRes = await messageModel.messageDel(mids);
    if (delMessageRes.affectedRows) ctx.body = { c: 0, m: '删除成功！' };
    else ctx.body = { c: 1, m: '删除失败！' };
    await next();
});

// 回复列表
messageController.get('/message/getMReplyList', async (ctx, next) => {
    let { mid, page } = ctx.query;
    page = (page < 1 || isNaN(page)) ? 1 : page;
    // 获取回复列表
    const replyList = await messageModel.getReplyList(mid, (page - 1) * adminConfig.MReplyLimit, adminConfig.MReplyLimit);
    ctx.body = {
        c: 0,
        d: {
            replyList,
            pageSize: adminConfig.MReplyLimit
        }
    }
    await next();
});
// 回复总数
messageController.get('/message/getMReplyCount', async (ctx, next) => {
    let { mid } = ctx.query;
    const replyCountRes = await messageModel.getReplyCount(mid);
    ctx.body = {
        c: 0,
        d: { total: replyCountRes[0].replyCount }
    }
    await next();
});
// 删除回复
messageController.post('/message/MReplyDel', async (ctx, next) => {
    let { rids } = ctx.request.body;
    rids = Object.prototype.toString.call(rids) === '[object Array]' ? rids : [];
    if (!rids.length) {
        ctx.body = { c: 1, m: '请传递正确的回复id！' };
        return false;
    }
    const delReplyRes = await messageModel.m_replyDel(rids);
    if (delReplyRes.affectedRows) ctx.body = { c: 0, m: '删除成功！' };
    else ctx.body = { c: 1, m: '删除失败！' };
    await next();
});
module.exports = messageController;