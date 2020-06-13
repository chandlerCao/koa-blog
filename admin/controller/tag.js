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
    let { pagination = {}, params = {} } = ctx.request.body;

    const [
        searchValue,
        currentPage,
        pageSize] = [
            params.searchValue || '',
            pagination.currentPage || 1,
            pagination.pageSize || 10
        ]

    try {
        let tagList = await tagmodel.getTagList(searchValue, (currentPage - 1) * pageSize, pageSize);

        tagList = tagList.map(item => {
            item.tag_icon = `${ctx.state.host}/${ctx.state.icon_dir}/${item.tag_name}`
            return item
        })

        const tagCount = await tagmodel.tagCount(searchValue);
        ctx.body = {
            c: 0,
            d: {
                pagination: {
                    total: tagCount[0].total,
                    pageSize,
                    currentPage
                },
                tableData: tagList
            }
        }
    } catch (err) {
        ctx.body = {
            c: 1,
            m: '获取标签失败！'
        }
    }
    await next();
});
// 获取所有标签
tagController.get('/tag/getAllTag', async ctx => {
    let tagList = await tagmodel.getAllTag();

    ctx.body = {
        c: 0,
        d: tagList
    }
});
// 上传标签图片
tagController.post('/tag/uploadTagIcon', koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(config.root_dir, `${config.static_dir}/${config.tag_icon_dir}`), // 设置文件上传目录
        keepExtensions: true,    // 保持文件的后缀
        maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
        onFileBegin(name, file) {
            file.path = `${this.uploadDir}/${randomID()}`; // 设置文件上传目录
        }
    }
}), async ctx => {
    const { image } = ctx.request.files;
    let imgPath = image.path.split(ctx.state.static_dir)[1];
    ctx.body = {
        c: 0,
        d: {
            url: `${ctx.state.host}${imgPath}`,
            m: '标签图标上传成功！'
        }
    }
});
// 添加标签
tagController.post('/tag/tagAdd', async (ctx, next) => {
    const { tagName, tagIcon } = ctx.request.body;
    if (!tagName || !tagName.trim()) {
        ctx.body = {
            c: 1,
            m: '请填写标签名称！'
        }
        return;
    }
    if (!tagIcon || !tagIcon.trim()) {
        ctx.body = {
            c: 1,
            m: '请上传标签图片！'
        }
        return;
    }
    // 获取原有标签图标文件名
    const tagIconName = path.basename(tagIcon);
    // 重命名标签
    try {
        fs.renameSync(`${ctx.state.root_dir}/${ctx.state.static_dir}/${ctx.state.icon_dir}/${tagIconName}`, `${ctx.state.root_dir}/${ctx.state.static_dir}/${ctx.state.icon_dir}/${tagName}`);
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
        m: '标签添加成功！',
    }
    await next();
})
// 标签修改
tagController.post('/tag/tagUpd', async (ctx, next) => {
    const { tid, oldTagName, newTagName, oldTagIcon, newTagIcon } = ctx.request.body;
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
    if (!newTagIcon || !newTagIcon.trim()) {
        ctx.body = {
            c: 1,
            m: '请上传图片！'
        }
        return;
    }
    if (!oldTagIcon || !oldTagIcon.trim()) {
        ctx.body = {
            c: 1,
            m: '旧图片路径未找到！'
        }
        return;
    }
    // 删除上个标签图片
    if (oldTagName !== newTagName && oldTagIcon === newTagIcon) {
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
    if (oldTagIcon !== newTagIcon) {
        try {
            // 删除上个标签图片
            fs.unlinkSync(`${ctx.state.root_dir}/${ctx.state.static_dir}/${ctx.state.icon_dir}/${oldTagName}`);
        } catch (err) {
            console.log(err);
        }
        /* 重命名标签名称 */
        const tagFileName = path.basename(newTagIcon);
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
    try {
        const delTagRes = await tagmodel.TagDel(tids);
        ctx.body = {
            c: 0,
            m: '删除成功！'
        }
    } catch (error) {
        ctx.body = {
            c: 1,
            m: '删除失败！'
        }
    }
    await next();
});
// 获取标签详情
tagController.get('/tag/getTagByTid', async (ctx, next) => {
    const { tid } = ctx.query;
    if (!tid) {
        ctx.body = {
            c: 1,
            m: '请传递您要获取的标签id'
        }
        return;
    }
    const tagInfo = await tagmodel.getTagByTids([tid]);
    // 获取标签图片
    const tagIcon = `${ctx.state.host}/${ctx.state.icon_dir}/${tagInfo[0].tag_name}`;
    ctx.body = {
        c: 0,
        d: {
            tagInfo: tagInfo[0],
            tagIcon
        }
    }
});
module.exports = tagController