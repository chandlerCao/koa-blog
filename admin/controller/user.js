const Router = require('koa-router');
const MD5 = require('md5.js');
// 获取用户模型
const UserModel = require('../model/UserModel');
// 实例化用户模型
const usermodel = new UserModel();
const user = new Router();
const generateToken = require('../../middleware/token').generateToken;
const randomID = require('../../utils/random-id');
// 管理员登录
user.post('/user/login', async (ctx, next) => {
    let { username, password } = ctx.request.body;
    if (!username) {
        ctx.body = {
            c: 1,
            m: '请输入用户名！'
        }
        return false;
    }
    if (!password) {
        ctx.body = {
            c: 1,
            m: '请输入密码！'
        }
        return false;
    }
    // 查询用户是否已经存在
    const checkUserRes = await usermodel.checkUser(username);
    if (checkUserRes.length === 0) {
        ctx.body = {
            c: 1,
            m: '用户名不存在！',
        }
        return;
    }
    // 登录
    try {
        const md5stream = new MD5();
        md5stream.end(password);
        password = md5stream.read().toString('hex');
        const userInfo = await usermodel.login(username, password);
        const user = userInfo[0];
        if (user) {
            if (user.isAdmin !== 1) {
                ctx.body = {
                    c: 1,
                    m: '很抱歉，您不是系统管理员！',
                };
                return;
            }
            // 登录成功
            ctx.body = {
                c: 0,
                m: '登录成功！',
                d: {
                    username: user.username,
                    token: generateToken({ isAdmin: 1, uid: user.uid, username: user.username })
                }
            }
        } else {
            ctx.body = {
                c: 1,
                m: '密码错误！',
            }
        }
    } catch (err) {
        ctx.body = {
            c: 1,
            m: '登录失败！',
        }
    }
});
// 用户注册
user.post('/user/register', async ctx => {
    // 获取用户名和密码
    const { username, password } = ctx.request.body;
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
    // 检查是否已经存在
    const checkUserRes = await usermodel.checkUser(username)
    if (checkUserRes && checkUserRes.length) {
        ctx.body = {
            c: 1,
            m: '用户名已存在！'
        }
    } else {
        // 随机id
        const id = randomID();
        // 注册
        const res = await usermodel.register(id, username, password);
        ctx.body = {
            c: 0,
            m: '注册成功！',
            token: token({ uid: res.uid, username: res.username }, id)
        }
    }
});
user.post('/user/checkLogin', async ctx => {
    ctx.body = {
        c: 0
    }
});
module.exports = user;