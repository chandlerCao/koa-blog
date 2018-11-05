const Router = require('koa-router');
const ArticleModel = require('../model/ArticleModel');
const articleController = new Router();
const randomID = require('../../utils/random-id');
const dateDir = require('../../utils/date-dir');
const createStream = require('../../utils/createStream');
// 创建文章模型
const am = new ArticleModel();
// 文章添加
articleController.post('/article/articleAdd', async c => {
    // 获取文章信息
    const { articleData } = c.request.body;
    // 文章标题是否为空
    if (articleData.title.trim() === '') {
        c.body = {
            code: 1,
            msg: '请填写文章标题！'
        };
        return;
    }
    // 文章前言是否为空
    if (articleData.preface.trim() === '') {
        c.body = {
            code: 1,
            msg: '请填写文章前言！'
        };
        return;
    }
    // 文章内容是否为空
    if (articleData.content.trim() === '') {
        c.body = {
            code: 1,
            msg: '请填写文章内容！'
        };
        return;
    }
    // 创建文章id
    articleData.aid = randomID();
    try {
        const res = await am.articleAdd(articleData);
        if (res) {
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
articleController.post('/article/uploadImg', async c => {
    const image = c.request.files.image;
    const image_path = image.path;
    // 生成日期路径
    let date_dir = await dateDir();
    // 随机生成图片唯一id
    const imgId = randomID(15);
    // 存储图片
    await createStream(image_path, `${date_dir}/${imgId}`);
    // 将静态路径替换掉
    date_dir = date_dir.replace(/assets/i, '');
    c.body = {
        code: 0,
        domain: `${c.domain}:${c.port}`,
        key: `${date_dir}/${imgId}`
    }
});
module.exports = articleController;