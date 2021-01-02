const Router = require('koa-router');
const md5 = require('blueimp-md5');
// 获取用户模型
const UserModel = require('../model/UserModel');
// 实例化用户模型
const usermodel = new UserModel();
const user = new Router();

// 获取用户信息
user.get('/user/getUserInfo', async ctx => {
    const { uid = '' } = ctx.query
    const userInfo = (await usermodel.getUserInfo(uid))[0]
    if (!userInfo) {
        ctx.body = {
            c: 1,
            m: '未查询到当前用户！'
        }
        return
    }
    userInfo.avatar = ctx.state.host + '/' + userInfo.avatar;
    userInfo.password = userInfo.password
    ctx.body = {
        c: 0,
        d: { ...userInfo }
    }
});
// 获取用户列表
user.post('/user/getUserList', async ctx => {
    let { pagination = {}, params = {} } = ctx.request.body;

    const [
        searchValue,
        currentPage,
        pageSize] = [
            params.searchValue || '',
            pagination.currentPage || 1,
            pagination.pageSize || adminConfig.userLen
        ]


    let userList = await usermodel.userList(searchValue, (currentPage - 1) * pageSize, pageSize);

    userList = userList.map(item => {
        item.avatar = `${ctx.state.host}/${item.avatar}`
        return item
    })
    const userCount = await usermodel.userCount(searchValue);
    ctx.body = {
        c: 0,
        d: {
            pagination: {
                total: userCount[0].total,
                pageSize,
                currentPage
            },
            tableData: userList
        }
    }
});
// 修改用户信息
user.post('/user/editUserInfo', async ctx => {
    // 获取用户名和密码
    let { uid = '', username = '', password = '', password_confirm = '', avatar = '' } = ctx.request.body;
    if (uid.trim() === '') {
        ctx.body = {
            c: 1,
            m: '用户ID不能为空！',
        }
        return;
    }
    if (username.trim() === '') {
        ctx.body = {
            c: 1,
            m: '用户名不能为空！',
        }
        return;
    }
    if (password.trim() === '') {
        ctx.body = {
            c: 1,
            m: '密码不能为空！',
        }
        return;
    }
    if (password !== password_confirm) {
        ctx.body = {
            c: 1,
            m: '两次输入密码不一致！',
        }
        return;
    }
    if (avatar.trim() === '') {
        ctx.body = {
            c: 1,
            m: '请上传头像！',
        }
        return;
    }
    // 修改用户
    password = md5(password)
    avatar = avatar.replace(new RegExp(`${ctx.state.host}\/`), '');
    await usermodel.editUserInfo(uid, username, password, avatar);
    ctx.body = {
        c: 0,
        m: '用户信息成功修改！'
    }
});
// 删除用户
user.post('/user/deleteUser', async ctx => {
    let { uid = [] } = ctx.request.body;
    if (Object.prototype.toString.call(uid) !== '[object Array]' || uid.length === 0) {
        ctx.body = {
            c: 1,
            m: '参数错误！'
        }
        return false
    }
    uid = uid.join(',')
    const res = await usermodel.userDelete(uid);
    if (res.affectedRows) {
        ctx.body = {
            c: 0,
            m: '删除用户成功！'
        }
    } else {
        ctx.body = {
            c: 1,
            m: '删除用户失败！'
        }
    }
});
module.exports = user