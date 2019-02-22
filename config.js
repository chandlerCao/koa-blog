const config = {
    address: {
        domain: `localhost`,
        port: `8080`,
        host() {
            return `https://${this.domain}:${this.port}`
        }
    },
    // 数据库 w+kq=C6f0UCP
    db: {
        host: 'localhost',
        user: 'root',
        password: '759260',
        database: 'blog'
    },
    tag_icon_dir: 'tag-icon',
    static_dir: 'assets',
    dirname: __dirname,
    token: {
        // 秘钥
        // require('./utils/random-id')(50)
        secret: require('./utils/random-id')(50),
        // 周期
        expiresIn: '10h'
    }
};
module.exports = config;