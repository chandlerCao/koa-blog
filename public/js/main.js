//canvas雪花
const c = $('#canvasBg');
const g = c[0].getContext('2d');
let snowArr = [];
let timer = null;
let initTimer = null;
const win = $(window);
let starLen = Math.floor( win.width() / 80 );
function random() {
    return Math.random();
};
c.attr({
    width: win.width(),
    height: win.height()
});
win.resize(function() {
    clearTimeout(initTimer);
    initTimer = setTimeout(function() {
        clearTimeout(timer);
        starLen = Math.floor( win.width() / 100 );
        g.clearRect(0, 0, c.attr('width'), c.attr('height'));
        c.attr({
            width: win.width(),
            height: win.height()
        });
        snowArr = [];
        initStar();
        starFlash();
    }, 100);
});
initStar();
function initStar() {
    g.clearRect(0, 0, c.attr('width'), c.attr('height'));
    // 初始化每一个雪花
    for (var i = 0; i < starLen; i++) {
        let x = random() * c.attr('width');
        snowArr.push({
            x,
            startX: x,
            y: random() * c.attr('height'),
            speedY: 1,
            r: random() * 2 + 1,
            xNum: 0,
            range: random() * 40,
        });
    }
};
// 重绘
starFlash();
function starFlash() {
    g.clearRect(0, 0, c.attr('width'), c.attr('height'));
    for (var i = 0; i < starLen; i++) {
        g.fillStyle = '#fff';
        // y轴加
        snowArr[i].y += snowArr[i].speedY;
        if (snowArr[i].y >= win.height() + snowArr[i].r) snowArr[i].y = -snowArr[i].r;

        snowArr[i].xNum--;
        if (snowArr[i].xNum === -360) snowArr[i].xNum = 0;

        snowArr[i].x = snowArr[i].startX - snowArr[i].range * Math.sin(Math.PI / 180 * snowArr[i].xNum);
        
        g.beginPath();
        g.arc(snowArr[i].x, snowArr[i].y, snowArr[i].r, 0, Math.PI * 2);
        g.fill();
        g.closePath();
    };
    timer = setTimeout(() => {
        requestAnimationFrame(starFlash);
    }, 50);
};
const artItem = $('.article-item');
let index = 0;
actItemShow();
function actItemShow(art) {
    artItem.eq(index).addClass('act');
    setTimeout(() => {
        index ++;
        if( index < artItem.length ) actItemShow();
    }, 150);
}