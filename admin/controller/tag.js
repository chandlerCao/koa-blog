const Router = require('koa-router');
const TagModel = require('../model/TagModel');

const randomID = require('../../utils/random-id');
const fs = require('fs');
const path = require('path');
const config = require('../../config');
const koaBody = require('koa-body');

const tag = new Router();
const tagModel = new TagModel();
// 获取标签列表
tag.post('/tag/getTagList', async (ctx, next) => {
    try {
        const tagList = await tagModel.getTagList();
        ctx.body = {
            c: 0,
            d: tagList
        }
    } catch (err) {
        ctx.body = {
            c: 1,
            m: '获取标签失败！'
        }
    }
    await next();
});
// 上传标签图片
tag.post('/tag/uploadTagImg', koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(config.root_dir, `${config.static_dir}/${config.tag_icon_dir}`), // 设置文件上传目录
        keepExtensions: true,    // 保持文件的后缀
        maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
        onFileBegin(name, file) {
            file.path = `${this.uploadDir}/${randomID()}`; // 设置文件上传目录
        }
    }
}), async (ctx, next) => {
    const { image } = ctx.request.files;
    let relPath = image.path.split(ctx.state.static_dir)[1];
    relPath = relPath.replace(/\\/g, '\/');
    ctx.body = {
        c: 0,
        d: {
            src: `${ctx.state.host}${relPath}`
        }
    }
    await next();
});
// 添加标签
tag.post('/tag/tagAdd', async (ctx, next) => {
    const { tagName, tagImgSrc } = ctx.request.body;
    if (!tagName || !tagName.trim()) {
        ctx.body = {
            c: 1,
            m: '请填写标签名称！'
        }
        return;
    }
    if (!tagImgSrc || !tagImgSrc.trim()) {
        ctx.body = {
            c: 1,
            m: '请上传图片！'
        }
        return;
    }
    // 获取原有标签图标文件名
    const tagImgName = path.basename(tagImgSrc);
    try {
        fs.renameSync(`${ctx.state.root_dir}/${ctx.state.static_dir}/${ctx.state.icon_dir}/${tagImgName}`, `${ctx.state.root_dir}/${ctx.state.static_dir}/${ctx.state.icon_dir}/${tagName}`);
    } catch (err) {
        ctx.body = {
            c: 1,
            m: '图片解析错误，请重新上传图片！',
        }
        return;
    }
    let tagAddRes = null;
    try {
        tagAddRes = await tagModel.addTag(tagName);
    } catch (err) {
        ctx.body = {
            c: 1,
            m: '标签名称已存在！'
        }
        return;
    }
    if (!tagAddRes.affectedRows) {
        ctx.body = {
            c: 1,
            m: '标签添加失败！'
        }
        return;
    }
    ctx.body = {
        c: 0,
        m: '创建成功！',
    }
    await next();
})
// 标签删除
tag.post('/tag/delTag', async (ctx, next) => {
    const { tids } = ctx.request.body;
    if (!tids || !tids.length) {
        ctx.body = {
            c: 1,
            m: '请传递需要删除的标签！'
        }
        return;
    }
    const res = await tagModel.TagDel(tids);
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
    await next();
});
// 获取标签内容
tag.post('/tag/getTagByTid', async (ctx, next) => {
    const { tid } = ctx.request.body;
    if (!tid) {
        ctx.body = {
            c: 1,
            m: '请传递您要获取的标签id'
        }
        return;
    }
    const tagInfo = await tagModel.getTagByTid(tid);
    // 获取标签图片
    const tagImgSrc = `${ctx.state.host}/${ctx.state.icon_dir}/${tagInfo[0].tag_name}`;
    ctx.body = {
        c: 0,
        d: {
            tagInfo: tagInfo[0],
            tagImgSrc
        }
    }
})
module.exports = tag