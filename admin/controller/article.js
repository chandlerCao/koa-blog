const Router = require('koa-router');
const ArticleModel = require('../model/ArticleModel');
const articleController = new Router();
const randomID = require('../../utils/random-id');
const dateDir = require('../../utils/date-dir');
const createStream = require('../../utils/createStream');
// 创建文章模型
const am = new ArticleModel();
// 文章发布（修改）
articleController.post('/article/articleAdd', async c => {
    // 获取文章信息
    const { articleData } = c.request.body;
    if (!articleData) {
        c.body = {
            code: 1,
            msg: '请传递文章内容！'
        }
        return;
    }
    // 标题
    if (articleData.title.trim() === '') {
        c.body = {
            code: 1,
            msg: '请填写文章标题！'
        };
        return;
    }
    // 前言
    if (articleData.preface.trim() === '') {
        c.body = {
            code: 1,
            msg: '请填写文章前言！'
        };
        return;
    }
    // 内容
    if (articleData.markdownHtml.trim() === '') {
        c.body = {
            code: 1,
            msg: '请填写文章内容！'
        };
        return;
    }

    // 修改
    if (articleData.aid) {
        // 判断aid是否存在
        const is_article = await am.articleExists(articleData.aid);
        if (is_article.length) {
            const res = await am.articleUpdate(articleData);
            c.body = {
                code: 0,
                msg: '修改成功！',
                res
            }
        } else {
            c.body = {
                code: 1,
                msg: `It doesn't exist!`
            }
        }
    }
    // 新增
    else {
        // 创建文章id
        articleData.aid = randomID();
        try {
            const res = await am.articleAdd(articleData);
            if (res) {
                c.body = {
                    code: 0,
                    msg: '发布成功！'
                }
            }
        } catch (err) {
            console.log(err);
            c.body = {
                code: 1,
                msg: '发布失败！',
                errMsg: err
            }
        }
    }
});
// 文章列表
articleController.post('/article/articleList', async c => {
    const articleList = await am.articleList();
    c.body = {
        code: 0,
        msg: 'Successfully get the article list!',
        articleList
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
    await createStream(image_path, `${c.static_dir}/${date_dir}/${imgId}`);
    c.body = {
        code: 0,
        domain: `${c.domain}:${c.port}`,
        name: `${date_dir}/${imgId}`
    }
});
// 删除文章
articleController.post('/article/articleDel', async c => {
    const { aid } = c.request.body;
    const res = await am.articleDel(aid);
    if (res.affectedRows) {
        c.body = {
            code: 0,
            msg: '删除成功！'
        }
    } else {
        c.body = {
            code: 1,
            msg: '删除失败！'
        }
    }
});
// 获取文章内容
articleController.post('/article/articleContentByAid', async c => {
    const { aid } = c.request.body;
    if (aid === undefined) {
        c.body = {
            code: 1,
            msg: '请传递文章id'
        };
        return;
    }
    const articleRes = await am.articleContentByAid(aid);
    if (articleRes && articleRes.length) {
        const articleData = articleRes[0];
        articleData.cover_domain = `${c.domain}:${c.port}`;
        articleData.cover_name = articleData.cover;
        c.body = {
            code: 0,
            mgs: 'success',
            articleData
        }
    } else {
        c.body = {
            code: 1,
            msg: 'Fetch data failed'
        }
    }
});
module.exports = articleController;