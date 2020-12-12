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
    let { title = '', preface = '', cover = '', tag_id = 0, markdownTxt = '', content = '', state = 0 } = ctx.request.body;
    // 标题
    if (title.trim() === '') {
        ctx.body = {
            c: 1,
            m: '请填写文章标题！'
        };
        return false;
    }
    if (title.trim().length > 24) {
        ctx.body = {
            c: 1,
            m: '文章标题长度超出限制！'
        };
        return false;
    }
    // 前言
    if (preface.trim() === '') {
        ctx.body = {
            c: 1,
            m: '请填写文章前言！'
        };
        return false;
    }
    if (preface.trim().length > 255) {
        ctx.body = {
            c: 1,
            m: '文章前言超出长度限制！'
        };
        return false;
    }
    // 封面
    if (cover.trim() === '') {
        ctx.body = {
            c: 1,
            m: '请上传封面！'
        };
        return false;
    }
    // 标签
    if (tag_id === 0) {
        ctx.body = {
            c: 1,
            m: '请选择文章标签！'
        };
        return false;
    }
    // 内容
    if (markdownTxt.trim() === '' || content.trim() === '') {
        ctx.body = {
            c: 1,
            m: '请填写文章内容！'
        };
        return false;
    }
    // 截取文章封面名称
    cover = cover.replace(new RegExp(`${ctx.state.host}\/`), '');
    // 创建文章id
    await articlemodel.articleAdd(randomID(), title, preface, cover, tag_id, state, markdownTxt, content);
    ctx.body = {
        c: 0,
        m: '文章成功发布！'
    }
});
// 获取单个文章内容
articleController.get('/article/articleContentByAid', async ctx => {
    const { aid } = ctx.query;
    if (!aid) {
        ctx.body = {
            c: 1,
            m: '请传递文章id'
        };
        return false;
    }
    const articleRes = await articlemodel.articleContentByAid(aid);
    if (articleRes.length) {
        const articleData = articleRes[0];
        articleData.cover = ctx.state.host + '/' + articleData.cover;
        articleData.contentInfo = {
            markdownTxt: articleData.markdownTxt,
            content: articleData.content
        }
        delete articleData.markdownTxt
        delete articleData.content
        ctx.body = {
            c: 0,
            d: articleData
        }
    } else {
        ctx.body = {
            c: 1,
            m: '未查询到文章内容！'
        }
    }
});
// 文章更新
articleController.post('/article/articleUpdate', async ctx => {
    // 获取文章信息
    let { aid = '', title = '', preface = '', cover = '', tag_id = 0, markdownTxt = '', content = '', state = 0 } = ctx.request.body;
    // 文章id
    if (aid.trim() === '') {
        ctx.body = {
            c: 1,
            m: '请传递文章id！'
        };
        return false;
    }
    if (title.trim().length > 24) {
        ctx.body = {
            c: 1,
            m: '文章标题长度超出限制！'
        };
        return false;
    }
    // 标题
    if (title.trim() === '') {
        ctx.body = {
            c: 1,
            m: '请填写文章标题！'
        };
        return false;
    }
    if (preface.trim().length > 255) {
        ctx.body = {
            c: 1,
            m: '文章前言超出长度限制！'
        };
        return false;
    }
    // 前言
    if (preface.trim() === '') {
        ctx.body = {
            c: 1,
            m: '请填写文章前言！'
        };
        return false;
    }
    // 封面
    if (cover.trim() === '') {
        ctx.body = {
            c: 1,
            m: '请上传封面！'
        };
        return false;
    }
    // 标签
    if (tag_id === 0) {
        ctx.body = {
            c: 1,
            m: '请选择文章标签！'
        };
        return false;
    }
    // 内容
    if (markdownTxt.trim() === '' || content.trim() === '') {
        ctx.body = {
            c: 1,
            m: '请填写文章内容！'
        };
        return false;
    }
    // 截取文章封面名称
    cover = cover.replace(new RegExp(`${ctx.state.host}\/`), '');
    // 判断文章id是否存在
    const articleExists = await articlemodel.articleExists(aid)
    if (articleExists.length === 0) {
        ctx.body = {
            c: 1,
            m: '文章不存在！'
        }
        return false
    }
    // 更新文章
    await articlemodel.articleUpdate(title, preface, cover, tag_id, markdownTxt, content, state, aid);
    ctx.body = {
        c: 0,
        m: '文章成功更新！'
    }
});
// 文章列表
articleController.post('/article/getArticleList', async ctx => {
    let { pagination = {}, params = {} } = ctx.request.body;

    const [
        searchValue,
        state,
        tag,
        datePicker,
        currentPage,
        pageSize] = [
            params.searchValue || '',
            params.state || 'state',
            params.tag || 'tid',
            params.datePicker || [],
            pagination.currentPage || 1,
            pagination.pageSize || adminConfig.articleLen
        ]

    let start_date = datePicker[0] || '1970-01-01'
    let end_date = datePicker[1] || '2030-01-01'

    let articleList = await articlemodel.articleList(searchValue, state, tag, start_date, end_date, (currentPage - 1) * pageSize, pageSize);

    articleList = articleList.map(item => {
        item.cover = `${ctx.state.host}/${item.cover}`
        item.tag = {
            url: `${ctx.state.host}/${ctx.state.icon_dir}/${item.tag_name}`,
            name: item.tag_name
        }
        return item
    })
    const articleCount = await articlemodel.articleCount(searchValue, state, tag, start_date, end_date);
    ctx.body = {
        c: 0,
        d: {
            pagination: {
                total: articleCount[0].total,
                pageSize,
                currentPage
            },
            tableData: articleList,
        }
    }
});
// 获取文章回收站列表
articleController.post('/article/getDustbinList', async ctx => {
    let { pagination = {}, params = {} } = ctx.request.body;

    const [
        searchValue,
        tag,
        datePicker,
        currentPage,
        pageSize] = [
            params.searchValue || '',
            params.tag || 'tid',
            params.datePicker || [],
            pagination.currentPage || 1,
            pagination.pageSize || adminConfig.articleLen
        ]

    let start_date = datePicker[0] || '1970-01-01'
    let end_date = datePicker[1] || '2030-01-01'

    let articleList = await articlemodel.dustbinList(searchValue, tag, start_date, end_date, (currentPage - 1) * pageSize, pageSize);

    articleList = articleList.map(item => {
        item.cover = `${ctx.state.host}/${item.cover}`
        item.tag = {
            url: `${ctx.state.host}/${ctx.state.icon_dir}/${item.tag_name}`,
            name: item.tag_name
        }
        return item
    })
    const articleCount = await articlemodel.dustbinCount(searchValue, tag, start_date, end_date);
    ctx.body = {
        c: 0,
        d: {
            pagination: {
                total: articleCount[0].total,
                pageSize,
                currentPage
            },
            tableData: articleList,
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
    let imgPath = image.path.split(ctx.state.static_dir)[1];
    ctx.body = {
        c: 0,
        d: {
            url: `${ctx.state.host}${imgPath}`,
        },
        m: '文章封面成功上传！'
    }
});
// 删除文章
articleController.post('/article/articleDel', async ctx => {
    let { aid = [] } = ctx.request.body;
    if (Object.prototype.toString.call(aid) !== '[object Array]' || aid.length === 0) {
        ctx.body = {
            c: 1,
            m: '参数错误！'
        }
        return false
    }
    aid = aid.join(',')
    const res = await articlemodel.articleDel(aid);
    if (res.affectedRows) {
        ctx.body = {
            c: 0,
            m: '文章成功删除！'
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
    let { aid = [] } = ctx.request.body;
    if (Object.prototype.toString.call(aid) !== '[object Array]' || aid.length === 0) {
        ctx.body = {
            c: 1,
            m: '参数错误！'
        }
        return false
    }
    aid = aid.join(',')
    const res = await articlemodel.articleDustbin(aid);
    if (res.affectedRows) {
        ctx.body = {
            c: 0,
            m: '已成功将文章移动至回收站，可在回收站查看！'
        }
    } else {
        ctx.body = {
            c: 1,
            m: '回收失败！'
        }
    }
});
// 恢复文章至草稿箱
articleController.post('/article/articleRecovery', async ctx => {
    let { aid = [] } = ctx.request.body;
    if (Object.prototype.toString.call(aid) !== '[object Array]' || aid.length === 0) {
        ctx.body = {
            c: 1,
            m: '参数错误！'
        }
        return false
    }
    aid = aid.join(',')
    const res = await articlemodel.articleRecovery(aid);
    if (res.affectedRows) {
        ctx.body = {
            c: 0,
            m: '已成功将文章还原至草稿箱！'
        }
    } else {
        ctx.body = {
            c: 1,
            m: '还原失败！'
        }
    }
});
module.exports = articleController;