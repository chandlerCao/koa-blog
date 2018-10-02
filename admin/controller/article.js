const Router = require('koa-router');
const utils = require('../../utils/utils');
const ArticleModel = require('../model/ArticleModel');
const articleController = new Router();
const fs = require('fs');
// 创建文章模型
const am = new ArticleModel();
// 文章添加
articleController.post('/articleAdd', async c => {
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
    // 创建文章id
    articleData.aid = utils.getRandomIdByTime();
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
// 上传图片
articleController.post('/uploadImg', async c => {
    const image = c.request.files.image;
    const path = image.path;
    // 获取日期路径
    let dateDir = await utils.createDateDir();
    // 创建随机图片名称
    const imgId = utils.getRandomIdByTime(15);
    async function createImg() {
        return new Promise((res, rej) => {
            // 读入流
            const readStream = fs.createReadStream(path);
            // 写入流
            const writeStream = fs.createWriteStream(`${dateDir}/${imgId}`);
            readStream.on('data', buffer => {
                writeStream.write(buffer);
            });
            readStream.on('end', () => {
                res(dateDir.replace(/assets/, ''));
            });
        })
    };
    const url = await createImg();
    c.body = {
        code: 0,
        url: `http://${c.request.host}${url}/${imgId}`
    }
});
module.exports = articleController;