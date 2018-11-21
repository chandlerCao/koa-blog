module.exports = {
    address: {
        domain: 'http://192.168.1.35',
        port: 1111,
    },
    db: {
        host: 'localhost',
        user: 'root',
        password: '759260',
        database: 'blog'
    },
    tag_icon_dir: 'tag-icon',
    static_dir: 'assets',
    token: {
        secret: require('./utils/random-id')()
    },
    articleLen: 10
}