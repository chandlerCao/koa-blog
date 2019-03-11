const Router = require('koa-router');
const TagModel = require('../model/TagModel');

const randomID = require('../../utils/random-id');
const fs = require('fs');
const path = require('path');
const config = require('../../config');
const koaBody = require('koa-body');

const tagController = new Router();
const tagmodel = new TagModel();
// 获取标签列表
tagController.post('/tag/getTagList', async (ctx, next) => {
    try {
        const tagList = await tagmodel.getTagList();
        ctx.body = {
            c: 0,
            d: tagList
        }
    } catch (err) {
        ctx.body = {
            c: 1,
            m: '获取标签失败！',
            errMsg: err
        }
    }
    await next();
});
// 上传标签图片
tagController.post('/tag/uploadTagImg', koaBody({
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
tagController.post('/tag/tagAdd', async (ctx, next) => {
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
            errMsg: err
        }
        return;
    }
    let tagAddRes = null;
    try {
        tagAddRes = await tagmodel.addTag(tagName);
    } catch (err) {
        ctx.body = {
            c: 1,
            m: '标签名称已存在！',
            errMsg: err
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
// 标签修改
tagController.post('/tag/tagUpd', async (ctx, next) => {
    const { tid, oldTagName, newTagName, oldTagImgSrc, newTagImgSrc } = ctx.request.body;
    const tagExits = await tagmodel.getTagByTids([tid]);
    if (!tagExits.length) {
        ctx.body = {
            c: 1,
            m: '修改的标签不存在'
        };
        return;
    }
    if (!newTagName || !newTagName.trim()) {
        ctx.body = {
            c: 1,
            m: '请填写标签名称！'
        }
        return;
    }
    if (!oldTagName || !oldTagName.trim()) {
        ctx.body = {
            c: 1,
            m: '未传递原有标签名称！'
        }
        return;
    }
    if (!newTagImgSrc || !newTagImgSrc.trim()) {
        ctx.body = {
            c: 1,
            m: '请上传图片！'
        }
        return;
    }
    if (!oldTagImgSrc || !oldTagImgSrc.trim()) {
        ctx.body = {
            c: 1,
            m: '旧图片路径未找到！'
        }
        return;
    }
    // 删除上个标签图片
    if (oldTagName !== newTagName && oldTagImgSrc === newTagImgSrc) {
        try {
            fs.renameSync(`${ctx.state.root_dir}/${ctx.state.static_dir}/${ctx.state.icon_dir}/${oldTagName}`, `${ctx.state.root_dir}/${ctx.state.static_dir}/${ctx.state.icon_dir}/${newTagName}`);
        } catch (err) {
            ctx.body = {
                c: 1,
                m: '图片解析错误，请重新上传图片！',
                errMsg: err
            }
            return;
        }
    }
    if (oldTagImgSrc !== newTagImgSrc) {
        try {
            // 删除上个标签图片
            fs.unlinkSync(`${ctx.state.root_dir}/${ctx.state.static_dir}/${ctx.state.icon_dir}/${oldTagName}`);
        } catch (err) {
            console.log(err);
        }
        /* 重命名标签名称 */
        const tagFileName = path.basename(newTagImgSrc);
        try {
            fs.renameSync(`${ctx.state.root_dir}/${ctx.state.static_dir}/${ctx.state.icon_dir}/${tagFileName}`, `${ctx.state.root_dir}/${ctx.state.static_dir}/${ctx.state.icon_dir}/${newTagName}`);
        } catch (err) {
            ctx.body = {
                c: 1,
                m: '图片解析错误，请重新上传图片！',
                errMsg: err
            }
            return;
        }
    }
    const updTagRes = await tagmodel.updTag(tid, newTagName);
    if (updTagRes.affectedRows === 1) {
        ctx.body = {
            c: 0,
            m: '修改成功！'
        }
    } else {
        ctx.body = {
            c: 1,
            m: '修改失败！'
        }
    }
    await next();
})
// 标签删除
tagController.post('/tag/delTag', async (ctx, next) => {
    const { tids } = ctx.request.body;
    if (!tids || !tids.length) {
        ctx.body = {
            c: 1,
            m: '请传递需要删除的标签！'
        }
        return;
    }
    // 查询标签名称
    const tagInfo = await tagmodel.getTagByTids([tids]);
    for (const tagItem of tagInfo) {
        try {
            fs.unlinkSync(`${ctx.state.root_dir}/${ctx.state.static_dir}/${ctx.state.icon_dir}/${tagItem.tag_name}`)
        } catch (error) {
            console.log(error);
        }
    }
    // 删除结果
    const delTagRes = await tagmodel.TagDel(tids);
    if (delTagRes.affectedRows) {
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
tagController.post('/tag/getTagByTid', async (ctx, next) => {
    const { tid } = ctx.request.body;
    if (!tid) {
        ctx.body = {
            c: 1,
            m: '请传递您要获取的标签id'
        }
        return;
    }
    const tagInfo = await tagmodel.getTagByTids([tid]);
    // 获取标签图片
    const tagImgSrc = `${ctx.state.host}/${ctx.state.icon_dir}/${tagInfo[0].tag_name}`;
    ctx.body = {
        c: 0,
        d: {
            tagInfo: tagInfo[0],
            tagImgSrc
        }
    }
});
module.exports = tagController