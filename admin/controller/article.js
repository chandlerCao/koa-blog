const Router = require('koa-router');
const ArticleModel = require('../model/ArticleModel');
const articleController = new Router();
const randomID = require('../../utils/random-id');
const adminConfig = require('../admin.config');
const path = require('path');
const config = require('../../config');
const dateDir = require('../../utils/date-dir');
const koaBody = require('koa-body');
// 创建文章模型
const articlemodel = new ArticleModel();
// 文章发布（修改）
articleController.post('/article/articleAdd', async ctx => {
    // 获取文章信息
    const { articleData } = ctx.request.body;
    if (!articleData) {
        ctx.body = {
            c: 1,
            m: '请传递文章内容！'
        }
        return;
    }
    // 标题
    if (articleData.title.trim() === '') {
        ctx.body = {
            c: 1,
            m: '请填写文章标题！'
        };
        return;
    }
    // 前言
    if (articleData.preface.trim() === '') {
        ctx.body = {
            c: 1,
            m: '请填写文章前言！'
        };
        return;
    }
    // 内容
    if (articleData.markdownHtml.trim() === '') {
        ctx.body = {
            c: 1,
            m: '请填写文章内容！'
        };
        return;
    }
    // 截取文章封面名称
    articleData.cover = articleData.cover.replace(new RegExp(`${ctx.state.host}\/`), '');
    // 修改
    if (articleData.aid) {
        // 判断aid是否存在
        const is_article = await articlemodel.articleExists(articleData.aid);
        if (is_article.length) {
            const res = await articlemodel.articleUpdate(articleData);
            ctx.body = {
                c: 0,
                m: '修改成功！'
            }
        } else {
            ctx.body = {
                c: 1,
                m: `文章不存在！`
            }
        }
    }
    // 新增
    else {
        // 创建文章id
        articleData.aid = randomID();
        try {
            const res = await articlemodel.articleAdd(articleData);
            if (res) {
                ctx.body = {
                    c: 0,
                    m: '发布成功！'
                }
            }
        } catch (err) {
            console.log(err);
            ctx.body = {
                c: 1,
                m: '发布失败！'
            }
        }
    }
});
// 文章列表
articleController.post('/article/articleList', async ctx => {
    let { page } = ctx.request.body;
    if (!page || isNaN(page)) page = 1;
    const articleList = await articlemodel.articleList((page - 1) * adminConfig.articleLen, adminConfig.articleLen);
    // 文章总数
    const articleCount = await articlemodel.articleCount();
    ctx.body = {
        c: 0,
        d: {
            total: articleCount[0].total,
            articleList,
            pageSize: adminConfig.articleLen
        }
    }
});
// 上传图片
articleController.post('/article/uploadImg', koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(config.root_dir, `${config.static_dir}`), // 设置文件上传目录
        keepExtensions: true,    // 保持文件的后缀
        maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
        onFileBegin(name, file) {
            file.path = `${this.uploadDir}/${dateDir()}/${randomID()}`; // 设置文件上传目录
        }
    }
}), async ctx => {
    const { image } = ctx.request.files;
    let relPath = image.path.split(ctx.state.static_dir)[1];
    relPath = relPath.replace(/\\/g, '\/');
    ctx.body = {
        c: 0,
        d: {
            src: `${ctx.state.host}${relPath}`
        }
    }
});
// 删除文章
articleController.post('/article/articleDel', async ctx => {
    const { aids } = ctx.request.body;
    if (!aids || !aids.length) {
        ctx.body = {
            c: 1,
            m: '请传递需要删除的文章id！'
        }
        return;
    }
    if (aids.length > adminConfig.articleLen) {
        ctx.body = {
            c: 1,
            m: `批量删除数量不得大于${adminConfig.articleLen}条！`
        }
        return;
    }
    const res = await articlemodel.articleDel(aids);
    if (res.affectedRows) {
        ctx.body = {
            c: 0,
            m: '删除成功！'
        }
    } else {
        ctx.body = {
            c: 1,
            m: '删除失败！'
        }
    }
});
// 获取文章内容
articleController.post('/article/articleContentByAid', async ctx => {
    const { aid } = ctx.request.body;
    if (aid === undefined) {
        ctx.body = {
            c: 1,
            m: '请传递文章id'
        };
        return;
    }
    const articleRes = await articlemodel.articleContentByAid(aid);
    if (articleRes && articleRes.length) {
        const articleData = articleRes[0];
        articleData.cover = ctx.state.host + '/' + articleData.cover;
        ctx.body = {
            c: 0,
            mgs: 'success',
            d: articleData
        }
    } else {
        ctx.body = {
            c: 1,
            m: 'Fetch data failed'
        }
    }
});
module.exports = articleController;