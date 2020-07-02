const Router = require('koa-router');
const path = require('path');
const MD5 = require('md5.js');
// 获取用户模型
const UserModel = require('../model/UserModel');
// 实例化用户模型
const usermodel = new UserModel();
const config = require('../../config');
const user = new Router();
const generateToken = require('../../middleware/token').generateToken;
const randomID = require('../../utils/random-id');
const dateDir = require('../../utils/date-dir');
const koaBody = require('koa-body');
// 管理员登录
user.post('/user/login', async ctx => {
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
            // 登录成功
            ctx.body = {
                c: 0,
                m: '登录成功！',
                d: {
                    uid: user.uid,
                    token: generateToken({ uid: user.uid, username: user.username, isAdmin: user.isAdmin })
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
// 用户头像上传
user.post('/user/uploadUserAvatar', koaBody({
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
            m: '头像上传成功！'
        }
    }
});
// 用户注册
user.post('/user/register', async ctx => {
    // 获取用户名和密码
    let { username = '', password = '', password_confirm = '', avatar = '' } = ctx.request.body;
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
    // 检查是否已经存在
    const checkUserRes = await usermodel.checkUser(username)
    if (checkUserRes && checkUserRes.length) {
        ctx.body = {
            c: 1,
            m: '用户名已存在！'
        }
    } else {
        // 随机id
        const uid = randomID();
        // 注册
        const md5stream = new MD5();
        md5stream.end(password);
        password = md5stream.read().toString('hex');
        avatar = avatar.replace(new RegExp(`${ctx.state.host}\/`), '');
        await usermodel.register(uid, username, password, avatar);
        ctx.body = {
            c: 0,
            d: {
                uid,
                token: generateToken({ uid, username, isAdmin: 1 })
            },
            m: '用户注册成功！'
        }
    }
});
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
    ctx.body = {
        c: 0,
        d: { ...userInfo }
    }
});
module.exports = user