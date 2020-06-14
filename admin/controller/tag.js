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
tagController.post('/tag/tagAdd', async ctx => {
    const { tag_name, tag_icon } = ctx.request.body;
    if (tag_name.trim() === '') {
        ctx.body = {
            c: 1,
            m: '请填写标签名称！'
        }
        return;
    }
    if (tag_icon.trim() === '') {
        ctx.body = {
            c: 1,
            m: '请上传标签图片！'
        }
        return;
    }
    // 获取原有标签图标文件名
    const tagIconName = path.basename(tag_icon);
    // 重命名标签
    try {
        fs.renameSync(`${ctx.state.root_dir}/${ctx.state.static_dir}/${ctx.state.icon_dir}/${tagIconName}`, `${ctx.state.root_dir}/${ctx.state.static_dir}/${ctx.state.icon_dir}/${tag_name}`);
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
        tagAddRes = await tagmodel.addTag(tag_name);
    } catch (err) {
        console.log(err)
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
})
// 标签修改
tagController.post('/tag/tagUpdate', async ctx => {
    const { tid = '', tag_name = '', tag_icon = '' } = ctx.request.body;
    if (tag_name.trim() === '') {
        ctx.body = {
            c: 1,
            m: '请填写标签名称！'
        }
        return;
    }
    if (tag_icon.trim() === '') {
        ctx.body = {
            c: 1,
            m: '请上传标签图片！'
        }
        return;
    }
    // 查询当前标签是否存在
    const tagInfo = await tagmodel.getTagByTid(tid);
    if (tagInfo.length === 0) {
        ctx.body = {
            c: 1,
            m: '未查询到当前标签信息！'
        }
        return
    }

    // 判断是否更改了标签图标
    let oldIconName = path.basename(tag_icon)
    const tagExist = tagmodel.getTagByTagName(oldIconName)
    // 如果没有更改图标的情况下，但是标签名称换了
    if (tagExist.length && tag_name !== tagInfo[0].tag_name) {
        oldIconName = tagInfo[0].tag_name
    }

    try {
        fs.renameSync(`${ctx.state.root_dir}/${ctx.state.static_dir}/${ctx.state.icon_dir}/${oldIconName}`, `${ctx.state.root_dir}/${ctx.state.static_dir}/${ctx.state.icon_dir}/${tag_name}`);
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
        tagAddRes = await tagmodel.updateTag(tid, tag_name);
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
            m: '标签修改失败！'
        }
        return;
    }
    ctx.body = {
        c: 0,
        m: '标签修改成功！',
    }
})
// 标签删除
tagController.post('/tag/tagDelete', async ctx => {
    let { tid = [] } = ctx.request.body;
    if (Object.prototype.toString.call(tid) !== '[object Array]' || tid.length === 0) {
        ctx.body = {
            c: 1,
            m: '参数错误！'
        }
        return false
    }
    tid = tid.join(',')
    const res = await tagmodel.tagDelete(tid);
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
// 获取标签详情
tagController.get('/tag/getTagByTid', async ctx => {
    const { tid } = ctx.query;
    if (!tid) {
        ctx.body = {
            c: 1,
            m: '请传递您要获取的标签id'
        }
        return;
    }
    const tagInfo = await tagmodel.getTagByTid(tid);
    if (tagInfo.length === 0) {
        ctx.body = {
            c: 1,
            m: '未查询到当前标签信息！'
        }
        return
    }
    // 获取标签图片
    tagInfo[0].tag_icon = `${ctx.state.host}/${ctx.state.icon_dir}/${tagInfo[0].tag_name}`;
    ctx.body = {
        c: 0,
        d: tagInfo[0]
    }
});
module.exports = tagController