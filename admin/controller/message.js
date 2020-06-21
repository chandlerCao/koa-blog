const Router = require('koa-router');
const MessageModel = require('../model/messageModel');
const messageController = new Router();
// 创建留言模型
const messageModel = new MessageModel();

// 留言列表
messageController.post('/message/getMessageList', async ctx => {
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

    const messageList = await messageModel.messageList(searchValue, start_date, end_date, (currentPage - 1) * pageSize, pageSize);

    const messageCount = await messageModel.messageCount(searchValue, start_date, end_date);
    ctx.body = {
        c: 0,
        d: {
            pagination: {
                total: messageCount.length,
                pageSize,
                currentPage
            },
            tableData: messageList
        }
    }
});
// 删除留言
messageController.post('/message/deleteMessage', async ctx => {
    let { mid = [] } = ctx.request.body;
    if (Object.prototype.toString.call(mid) !== '[object Array]' || mid.length === 0) {
        ctx.body = {
            c: 1,
            m: '参数错误！'
        }
        return false
    }
    mid = mid.join(',')
    const res = await messageModel.messageDel(mid);
    if (res.affectedRows) {
        ctx.body = {
            c: 0,
            m: '留言删除成功！'
        }
    } else {
        ctx.body = {
            c: 1,
            m: '留言删除失败！'
        }
    }
});
// 回复列表
messageController.post('/message/getReplyList', async ctx => {
    let { pagination = {}, params = {} } = ctx.request.body;
    const [
        searchValue,
        messageInfo,
        datePicker,
        currentPage,
        pageSize] = [
            params.searchValue || '',
            params.messageInfo || '',
            params.datePicker || [],
            pagination.currentPage || 1,
            pagination.pageSize || 10
        ]

    let start_date = datePicker[0] || '1970-01-01'
    let end_date = datePicker[1] || '2030-01-01'

    const replyList = await messageModel.replyList(searchValue, messageInfo, start_date, end_date, (currentPage - 1) * pageSize, pageSize);

    const replyCount = await messageModel.replyCount(searchValue, messageInfo, start_date, end_date);
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
messageController.post('/message/deleteReply', async ctx => {
    let { rid = [] } = ctx.request.body;
    if (Object.prototype.toString.call(rid) !== '[object Array]' || rid.length === 0) {
        ctx.body = {
            c: 1,
            m: '参数错误！'
        }
        return false
    }
    rid = rid.join(',')
    const res = await messageModel.replyDel(rid);
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
module.exports = messageController;