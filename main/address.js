const getAddress = require('../middleware/getAddress');
module.exports = app => {
    app.use(getAddress);
}