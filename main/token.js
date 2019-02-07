const decodeToken = require('../middleware/token').decodeToken;
module.exports = app => {
    app.use(decodeToken);
}