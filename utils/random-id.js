module.exports = (len = 24) => {
    if (len < 11) len = 11;
    let id = '';
    for (let i = 0; i < len - 11; i++) {
        id += Math.floor(Math.random() * 16).toString(16);
    }
    id += new Date().getTime().toString(16);
    return id;
}