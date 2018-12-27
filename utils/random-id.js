module.exports = (len = 24) => {
    return new Array(len).fill('').map(item => {
        item = Math.floor(Math.random() * 16).toString(16);
    }).join('') + new Date().getTime().toString(16);
}