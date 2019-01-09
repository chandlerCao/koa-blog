module.exports = {
    address: {
        domain: `localhost`,
        port: 8080,
    },
    // 数据库
    db: {
        host: 'localhost',
        user: 'root',
        password: '759260',
        database: 'blog'
    },
    tag_icon_dir: 'tag-icon',
    static_dir: 'assets',
    token: {
        // 秘钥
        secret: require('./utils/random-id')(50),
        // 周期
        expiresIn: '10h'
    }
}