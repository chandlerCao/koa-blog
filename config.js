const config = {
    address: {
        http: {
            port: 7070,
            host: `http://localhost:7070`
        },
        https: {
            port: 8080,
            host: `http://localhost:8080`
        }
    },
    tag_icon_dir: 'tag-icon',
    static_dir: 'assets',
    root_dir: __dirname,
};
module.exports = config;