const config = {
    address: {
        http: {
            port: 7070,
            host() {
                return `http://localhost:${this.port}`
            }
        },
        https: {
            port: 8080,
            host() {
                return `https://localhost:${this.port}`
            }
        }
    },
    tag_icon_dir: 'tag-icon',
    static_dir: 'assets',
    root_dir: __dirname,
};
module.exports = config;