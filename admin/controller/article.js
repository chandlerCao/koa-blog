const router = require('koa-router')();
const utils = require('../../utils/utils');
const ArticleModel = require('../model/ArticleModel');
const fs = require('fs');
router.post('/admin/articleAdd', async c => {
    const token = c.header.authorization;
    if( token === '' ) {
        c.throw(401, 'Token failure');
    }
    try {
        const userInfo = utils.verifyToken(token);
        // 获取文章信息
        const {articleData} = c.request.body;
        console.log( articleData.base64 );
        if( articleData.title.trim() === '' ) {
            c.body = {
                code: 1,
                msg: '请填写文章标题！'
            };
            return;
        }
        if( articleData.preface.trim() === '' ) {
            c.body = {
                code: 1,
                msg: '请填写文章前言！'
            };
            return;
        }
        if( articleData.tag.trim() === '' ) {
            c.body = {
                code: 1,
                msg: '请选择文章标签！'
            };
            return;
        }
        if( articleData.content.trim() === '' ) {
            c.body = {
                code: 1,
                msg: '请填写文章内容！'
            };
            return;
        }
        // 创建文字模型
        const am = new ArticleModel();
        // 创建文章id
        articleData.aid = utils.getRandomIdByTime();
        // 解析图片，并存储
        if( articleData.base64 !== '' ) {
            const base64 = articleData.base64;
            const buffer = new Buffer(base64, 'base64');
            fs.writeFile(`index/public/img/${articleData.aid}.png`, buffer, err => {
                if(err) {
                    c.body = {
                        code: 1,
                        msg: '图片体积过大！'
                    }
                }
            })
        }
        try {
            const res = await am.articleAdd(articleData);
            c.body = {
                code: 0,
                msg: '添加成功！'
            }
        } catch (err) {
            c.body = {
                code: 1,
                msg: '添加失败！'
            }
        }
    } catch (err) {
        c.throw(401, 'Token failure');
    }
});
module.exports = router