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
// 文章发布
articleController.post('/article/articleAdd', async ctx => {
    // 获取文章信息
    const { articleData } = ctx.request.body;
    if (articleData.state) {
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
    }
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
        ctx.body = {
            c: 1,
            m: '发布失败！'
        }
    }
});
// 文章更新
articleController.post('/article/articleEdit', async ctx => {
    // 获取文章信息
    const { articleData } = ctx.request.body;
    if (articleData.state) {
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
    }
    // 判断文章是否存在
    const articleExists = await articlemodel.articleExists(articleData.aid);
    if (articleExists.length) {
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
});
// 文章列表
articleController.get('/article/articleList', async ctx => {
    let { page, state } = ctx.query;
    if (!page || isNaN(page)) page = 1;
    const articleList = await articlemodel.articleList(state, (page - 1) * adminConfig.articleLen, adminConfig.articleLen);
    // 文章总数
    const articleCount = await articlemodel.articleCount(state);
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
    let { aids } = ctx.request.body;
    aids = Object.prototype.toString.call(aids) === '[object Array]' ? aids : [];
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
// 移动文章到垃圾箱
articleController.post('/article/articleDustbin', async ctx => {
    let { aids } = ctx.request.body;
    aids = Object.prototype.toString.call(aids) === '[object Array]' ? aids : [];
    if (aids.length > adminConfig.articleLen) {
        ctx.body = {
            c: 1,
            m: `批量删除数量不得大于${adminConfig.articleLen}条！`
        }
        return;
    }
    const res = await articlemodel.articleDustbin(aids);
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
articleController.get('/article/articleContentByAid', async ctx => {
    const { aid } = ctx.query;
    if (!aid) {
        ctx.body = {
            c: 1,
            m: '请传递文章id'
        };
        return;
    }
    const articleRes = await articlemodel.articleContentByAid(aid);
    if (articleRes && articleRes.length) {
        const articleData = articleRes[0];
        if (articleData.cover) articleData.cover = ctx.state.host + '/' + articleData.cover;
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
// 文章搜索
articleController.get('/article/getArticleBySearch', async (ctx, next) => {
    let { searchValue, page, state } = ctx.query;
    state = Number(state);
    // 查询限制条数
    const articleLen = adminConfig.articleLen;
    const skip = (page - 1) * articleLen;
    const d = {};

    // 文章列表
    d.articleList = await articlemodel.getArticleBySearch(searchValue, state, skip, articleLen);

    // 文章总数
    let total = await articlemodel.getArticleTotalBySearch(searchValue, state);
    total = total[0].total;
    d.total = total;

    // 每页显示条数
    d.pageSize = articleLen;

    ctx.body = {
        c: 0,
        d
    }
    await next();
});
module.exports = articleController;