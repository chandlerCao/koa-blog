module.exports = (len = 24) => {
    len = len < 11 ? 11 : len;
    return new Array(len - 11).fill('').map(item => {
        return Math.floor(Math.random() * 16).toString(16);
    }).join('') + new Date().getTime().toString(16);
}