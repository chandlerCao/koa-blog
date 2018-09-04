// 生成随机id
function getRandomIdByTime() {
    let id = '';
    for (let i = 0; i < 13; i++) {
        id += Math.floor( Math.random() * 16 ).toString(16);
    }
    id += new Date().getTime().toString(16);
    return id;
};
module.exports = {
    getRandomIdByTime
}