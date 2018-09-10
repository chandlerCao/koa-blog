const router = require('koa-router')();
// 工具包
const utils = require('../../utils/utils');
// 获取用户模型
const UserModel = require('../model/UserModel');

// 用户登录
router.post('/admin/login', async c => {
    const {username, password} = c.request.body;
    if( username.trim() === '' ) {
        c.body = {
            code: 1,
            msg: '用户名不能为空！',
        }
        return;
    }
    if( password.trim() === '' ) {
        c.body = {
            code: 1,
            msg: '密码不能为空！',
        }
        return;
    }
    // 实例化用户模型
    const usermodel = new UserModel();
    // 查询用户是否已经存在
    const checkRes = await usermodel.checkUser(username)
    if( !checkRes || !checkRes.length ) {
        c.body = {
            code: 1,
            msg: '用户名不存在！',
        }
    }
    else {
        // 登录
        try {
            const getUserInfo = await usermodel.login(username, password);
            if( getUserInfo[0].isAdmin !== 1 ) {
                c.body = {
                    code: 1,
                    msg: '很抱歉，您不是系统管理员！',
                };
                return;
            }
            if( !getUserInfo || !getUserInfo.length ) {
                c.body = {
                    code: 1,
                    msg: '密码错误！',
                }
                return;
            }
            // 生成token
            c.body = {
                code: 0,
                msg: '登录成功！',
                token: utils.createToken(getUserInfo[0].uid, getUserInfo[0].username)
            }
        } catch (err) {
            c.body = {
                code: 1,
                msg: '登录失败！',
            }
        }
    }
});
// 用户注册
router.post('/admin/register', async c => {
    // 获取用户名和密码
    const {username, password} = c.request.body;
    if( username.trim() === '' ) {
        c.body = {
            code: 1,
            msg: '用户名不能为空！',
        }
        return;
    }else if( password.trim() === '' ) {
        c.body = {
            code: 1,
            msg: '密码不能为空！',
        }
        return;
    }
    // 实例化用户模型
    const usermodel = new UserModel();
    // 检查是否已经存在
    const checkRes = await usermodel.checkUser(username)
    if( checkRes && checkRes.length ) {
        c.body = {
            code: 1,
            msg: '用户名已存在！'
        }
    }else {
        // 随机id
        const id = utils.getRandomIdByTime();
        // 注册
        const res = await usermodel.register(id, username, password);
        c.body = {
            code: 0,
            msg: '注册成功！',
            token: utils.createToken(res.uid, res.username)
        }
    }
});
module.exports = router;