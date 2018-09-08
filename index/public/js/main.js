// 雪花
(function() {
    const c = $('#canvasBg');
    const g = c[0].getContext('2d');
    const color = '#bfdfff';
    let snowArr = [];
    let timer = null;
    let initTimer = null;
    const win = $(window);
    let starLen = Math.floor( win.width() / 80 );
    starLen = starLen < 10 ? 10 : starLen;
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
                x: x,
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
            g.fillStyle = color;
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
        timer = setTimeout(function() {
            requestAnimationFrame(starFlash);
        }, 50);
    };
})();
// 博客列表初始化
function add() {
    var color = '#fff';
    var noteH = $(this).height();
    var span = $(this).find('span:first');
    var cntH = span.height();

    if( noteH > cntH ) return;
    
    var fontSize = parseInt( span.css('font-size') );
    var lineH = parseInt( span.css('line-height') );
    var lineCount = Math.ceil( noteH / lineH ) - 1;
    var top = lineCount * lineH;
    
    var paddingTop = parseInt( $(this).css('paddingTop') );

    var mask = $('<div style="position: absolute; width: 100%; height: 40px; background-color: '+color+'; left: 0; top: '+(top+paddingTop)+'px;"></div>');

    var ellipsis = $('<span style="position: absolute; width: '+(fontSize)+'px; text-align: left; right: 0; top: '+( ( ( lineCount-1 ) * lineH ) + paddingTop )+'px; background-color: '+color+';">...</span>')

    $(this).append(mask, ellipsis);
}
$.fn.extend({
    add: add
});

window.onload = function() {
    const artItem = $('.article-item');
    let index = 0;
    actItemShow();
    function actItemShow(art) {
        artItem.eq(index).addClass('act');
        setTimeout(function() {
            index ++;
            if( index < artItem.length ) actItemShow();
        }, 100);
    }
    var artNote = $('.art-note');

    artNote.each(function(index, el) {
        $(el).add();
    });
}


$('.art-heart').click(function() {
    $(this).find('.heart:first').toggleClass('heartBlast');
});