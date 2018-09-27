const Router = require('koa-router');
const utils = require('../../utils/utils');
const ArticleModel = require('../model/ArticleModel');
const fs = require('fs');
const article = new Router();
article.post('/articleAdd', async c => {
    // 获取文章信息
    const {articleData} = c.request.body;
    // 文章标题是否为空
    if( articleData.title.trim() === '' ) {
        c.body = {
            code: 1,
            msg: '请填写文章标题！'
        };
        return;
    }
    // 文章前言是否为空
    if( articleData.preface.trim() === '' ) {
        c.body = {
            code: 1,
            msg: '请填写文章前言！'
        };
        return;
    }
    // 文章内容是否为空
    if( articleData.content.trim() === '' ) {
        c.body = {
            code: 1,
            msg: '请填写文章内容！'
        };
        return;
    }
    // 创建文章模型
    const am = new ArticleModel();
    // 创建文章id
    articleData.aid = utils.getRandomIdByTime();
    // 未上线
    articleData.online = 0;
    // 解析图片，并存储
    if( articleData.base64 !== '' ) {
        const base64 = articleData.base64;
        try {
            const buffer = new Buffer(base64, 'base64');
            fs.writeFile(`assets/article-img/${articleData.aid}.png`, buffer, err => {
                if(err) {
                    c.body = {
                        code: 1,
                        msg: '图片体积过大！',
                        errMsg: err
                    }
                }
            })
        } catch (err) {
            c.body = {
                code: 1,
                msg: '图片解析失败！',
                errMsg: err
            }
        }
    }
    try {
        const res = await am.articleAdd(articleData);
        if( res ) {
            c.body = {
                code: 0,
                msg: '添加成功！'
            }
        }
    } catch (err) {
        c.body = {
            code: 1,
            msg: '添加失败！',
            errMsg: err
        }
    }
});
module.exports = article;