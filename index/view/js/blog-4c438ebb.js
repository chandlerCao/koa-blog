!function(t){var e={};function a(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,a),i.l=!0,i.exports}a.m=t,a.c=e,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)a.d(n,i,function(e){return t[e]}.bind(null,i));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="",a(a.s=2)}([function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=e.body=$("body:first");e.Loading=function t(){this.loading_box=$('<div class="com-loading-box">\n        <div class="com-loading-main">\n            <div class="com-loading-item"></div>\n            <div class="com-loading-item"></div>\n            <div class="com-loading-item"></div>\n        </div>\n    </div>'),t.prototype.show=function(){return this.loading_box.appendTo($(document.body)),this},t.prototype.hide=function(){return this.loading_box.remove(),this}},e.Page=function t(e){this.el=e.par||$(),this.total=e.total||0,this.total<1||(this.page_size=e.page_size||0,this.now_page=e.now_page||1,this.url=e.url||"javascript:;",this.theme=e.theme||"#3b8cff",this.on_change=e.on_change||function(){},this.page_len=Math.ceil(this.total/this.page_size),t.prototype.init=function(){this.el.append('<div class="com-page-box">\n                <span class="com-page-total">共 '+this.total+' 条</span>\n                <div class="com-page-ul">'+this.create_page_num()+"</div>\n            </div>\n        ")},t.prototype.create_page_num=function(){var t=this.page_len,e="",a=1===this.now_page;e+='<a href="'+(a?"javascript:;":this.url+(this.now_page-1))+'" class="com-page-prev fa fa-angle-left'+(a?" disabled":"")+'"></a>',e+='<a href="'+this.url+'1" class="com-page-num" '+(a?'style="border: 1px solid '+this.theme+"; color: "+this.theme+'"':"")+' data-page="1">1</a>',this.now_page>5?e+='<a href="'+this.url+(this.now_page-5<1?1:this.now_page-5)+'" class="com-page-li-jump__prev">\n                <i class="page-ellipsis"></i>\n                <i class="page-arrow page-arrow-left fa fa-angle-double-left" style="color: '+this.theme+';"></i>\n            </a>':this.el.find(".com-page-li-jump__prev:first").remove();var n=1,i=0;this.now_page<=5?(n=2,i=this.now_page+2):this.now_page>t-5?(n=this.now_page-2,i=t-1):(n=this.now_page-2,i=this.now_page+2);for(var o=n;o<=i&&!(o>t-1);o++)e+='<a href="'+this.url+o+'" class="com-page-num" '+(o===this.now_page?'style="border: 1px solid '+this.theme+"; color: "+this.theme+'"':"")+'  data-page="'+o+'">'+o+"</a>";this.now_page<=t-5?e+='<a href="'+this.url+(this.now_page+5>t?t:this.now_page+5)+'" class="com-page-li-jump__next">\n                <i class="page-ellipsis"></i>\n                <i class="page-arrow page-arrow-right fa fa-angle-double-right" style="color: '+this.theme+';"></i>\n            </a>':this.el.find(".com-page-li-jump__next:first").remove();var r=this.now_page===t;return 1!==t&&(e+='<a href="'+this.url+t+'" class="com-page-num" '+(r?'style="border: 1px solid '+this.theme+"; color: "+this.theme+'"':"")+' data-page="'+t+'">'+t+"</a>"),e+='<a href="'+(r?"javascript:;":this.url+(this.now_page+1))+'" class="com-page-next fa fa-angle-right'+(r?" disabled":"")+'"></a>'},t.prototype.page_listener=function(){var t=this;this.el.find(".com-page-num").on("click",function(){t.on_change($(this).data("page"))}).on("mouseover",function(){t.now_page!==$(this).data("page")&&t.Page_add_active($(this))}).on("mouseout",function(){t.now_page!==$(this).data("page")&&t.Page_remove_active($(this))}),this.el.find(".com-page-prev:first").on("mouseover",function(){1!==t.now_page&&t.Page_add_active($(this))}),this.el.find(".com-page-prev:first").on("mouseout",function(){1!==t.now_page&&t.Page_remove_active($(this))}),this.el.find(".com-page-next").on("mouseover",function(){t.now_page!==t.page_len&&t.Page_add_active($(this))}),this.el.find(".com-page-next").on("mouseout",function(){t.now_page!==t.page_len&&t.Page_remove_active($(this))})},t.prototype.Page_add_active=function(t){t.css({border:"1px solid "+this.theme,color:this.theme})},t.prototype.Page_remove_active=function(t){t.css({border:"1px solid #dcdee2",color:"#000"})},this.init(),this.page_listener())},e.Tooltip=function t(e){this.el=e.el||$(),this.theme=e.theme||"dark",this.content=e.content||"默认文字",this.tooltip_dis=10,this.ani_dis=10,t.prototype.event=function(){var t=this;t.el.hover(function(){t.show()},function(){t.hide()})},t.prototype.show=function(){this.tooltip_box=$('<div class="com-tooltip-box '+this.theme+'">'+this.content+"</div>");var t=this.tooltip_box;$(document.body).append(t);var e=(this.el.width()-t.outerWidth())/2+this.el.offset().left,a=this.el.offset().top-t.outerHeight()-this.tooltip_dis;t.css({left:e,top:a-this.ani_dis}).animate({opacity:1,top:a},250)},t.prototype.hide=function(){this.tooltip_box.animate({opacity:0,top:"-="+this.ani_dis+"px"},250,function(){$(this).remove()})},this.event()},e.PageUp=function t(e){this.scroll_el=e.scroll_el||n,this.parent_el=e.parent_el||n;var a=e.styles||{},i=a.right,o=a.bottom;this.pageup_btn=$('<div class="com-page-up" style="right: '+i+"px; bottom: "+o+'px;">\n        <i class="fa fa-caret-up"></i>\n    </div>'),this.parent_el.append(this.pageup_btn),t.prototype.handler=function(){var t=this;this.pageup_btn.click(function(){t.scroll_el.animate({scrollTop:0},300)}).hover(function(){$(this).addClass("rubberBand animated")},function(){$(this).removeClass("rubberBand animated")})},this.handler()}},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.tmp=e.storage=e.toZero=e.formateDate=e.picture3DSwitch=e.getParmasByHash=e.ajax=e.navData=e.host=void 0;var n=a(0),i=e.host="",o=(e.navData=[{reg:/^article\?type=technology&page=(\d+)$/,name:"technology",href:"#article?type=technology&page=1",text:"前端",target:"",icon:"fa fa-html5",element:$('<section id="article-box" class="blog-element"></section>'),reqUrl:"/index/article/getArticleList",cb:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new Promise(function(a){o(t.reqUrl,e).then(function(e){var i=e.data,o=i.articleList;o.map(function(t){t.date=t.date.split("T")[0]});var s=doT.template(c.articleTmp);t.element.html(s(o)),new n.Page({par:t.element,total:i.total,page_size:i.page_size,now_page:parseInt(r().page),theme:"#3b8cff",url:"#article?page=",on_change:function(){$("#app").animate({scrollTop:0},"fast")}}),a()})})}},{reg:/^article\?type=live&page=(\d+)$/,name:"live",href:"#article?type=live&page=1",text:"生活",target:"",icon:"fa fa-coffee",element:$('<section id="live-box" class="blog-element"></section>'),reqUrl:"/index/article/getArticleList",cb:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new Promise(function(a){o(t.reqUrl,e).then(function(e){var i=e.data,o=i.articleList;o.map(function(t){t.date=t.date.split("T")[0]});var s=doT.template(c.articleTmp);t.element.html(s(o)),new n.Page({par:t.element,total:i.total,page_size:i.page_size,now_page:parseInt(r().page),url:"#article?page=",on_change:function(){$("#app").animate({scrollTop:0},"fast")}}),a()})})}},{reg:/^aboutMe$/,href:"http://resume.caodj.cn",text:"简历",target:'target="_blank"',icon:"fa fa-book",element:$('<section id="mood-box" class="blog-element"></section>'),reqUrl:"/index/article/getArticleList"},{reg:/^article\?tag=(\w+)&page=(\d+)$/,name:"articleTagList",element:$('<section id="article-tag-box" class="blog-element"></section>'),reqUrl:"/index/article/getArticleListByTag",cb:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new Promise(function(a){o(t.reqUrl,e).then(function(e){var i=e.data,o=i.articleList;o.map(function(t){t.date=t.date.split("T")[0]});var s=doT.template(c.articleTmp);t.element.html(s(o)),new n.Page({par:t.element,total:i.total,page_size:i.page_size,now_page:parseInt(r().page),url:"#article?tid="+r().tid+"&page=",on_change:function(){$("#app").animate({scrollTop:0},"fast")}}),a()})})}},{reg:/^article\?aid=(\w+)$/,name:"articleContent",element:$('<section id="markdown-box" class="blog-element"></section>'),reqUrl:"/index/article/getArticleCnt",fns:{createCatalog:function(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=/<(h[1-3])><a id="(\w+)"><\/a>(.+)<\/\1>/gi,a=void 0,n="";null!==(a=e.exec(t));){n+='<div class="catalog-item catalog-'+a[1]+'" data-id="'+a[2]+'">\n                    <a href="javascript:;" class="catalog-link">'+a[3]+"</a></div>"}return{catalogStr:n,handler:function(t){var e=$(".catalog-item");e.each(function(a,n){var i=$(this).data("id");$(n).data("top",$("#"+i).position().top-30),$(n).click(function(){e.removeClass("act"),$(this).addClass("act"),t.stop().animate({scrollTop:$(this).data("top")},400)})})}}},dateFormatter:function(t){return t.split("T")[0]}},cb:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new Promise(function(a){o(t.reqUrl,e).then(function(e){if(0===e.code){var n=e.articleContent;n.date=t.fns.dateFormatter(n.date);var i=t.fns.createCatalog(n.markdownHtml);n.catalog=i.catalogStr;var o=doT.template(c.articleCntTmp)(n),r=$(o).appendTo($('<div id="markdown-wrap"></div>').appendTo(t.element));i.handler(r),a()}})})}}],e.ajax=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return new Promise(function(a,n){$.ajax({type:"post",url:""+i+t,data:e,dataType:"json"}).done(function(t){a(t)}).catch(function(t){n(t)})})}),r=e.getParmasByHash=function(){var t=window.location.hash.match(/(\w+)=[^&]+/g),e={};return t&&t.length?(t.forEach(function(t){var a=t.split("=");e[a[0]]=a[1]}),e):{}},s=(e.picture3DSwitch=function(t,e){var a=t.width(),n=t.height(),i=void 0,o=void 0;function r(t){return new Promise(function(e,a){var n=new Image;n.onload=function(){e({w:n.width,h:n.height})},n.onerror=function(t){a(t)},n.src=t})}r(e[0]).then(function(r){i=r.w,o=r.h;var s=void 0,c=void 0;i<a?(s=a,c=n*a/i):o<n&&(c=n,s=a*n/o),function(i,o){var r=Math.floor(a/3),s=n/5,c="";new Array(15).fill("").forEach(function(t,a){var n="";e.forEach(function(t,e){var c="";0===e&&(c="transform: rotateY(0)"),1===e&&(c="transform: rotateY(90deg)"),2===e&&(c="transform: rotateY(180deg)"),3===e&&(c="transform: rotateY(270deg)");var l=a%3*r,p=Math.floor(a/3)*s;n+='<div style="position: absolute; width: 100%; height: 100%; left: 0; top: 0; background-image: url('+t+"); background-size: "+i+"px "+o+"px; background-position: "+-l+"px "+-p+"px; transform-origin: center center -"+r/2+"px; "+c+"; animation: picture3DSwitch"+(e+1)+" 20s "+(.04*a+2)+'s infinite"></div>'}),c+='<div style="transform-style: preserve-3d; float: left; position: relative; width: '+r+"px; height: "+s+'px;">'+n+"</div>"}),t.html(c)}(s,c)}).catch(function(t){}),r(e[0])},e.formateDate=function(t){var e=t.slice(0,t.length-5).replace("T"," "),a=parseInt(e.match(/\s(\d+)/)),n=s(a+8);return e.replace(/\s(\d+)/," "+n)},e.toZero=function(t){return t<10?"0"+t:t}),c=(e.storage={set:function(t,e){window.localStorage.setItem(t,JSON.stringify(e))},get:function(t){return JSON.parse(window.localStorage.getItem(t))}},e.tmp={navTmp:'{{~it:nav}}\n        <li class="nav-item" data-reg="{{=nav.reg}}">\n            <a href="{{=nav.href}}" class="nav-outer" {{=nav.target}}>\n                <span class="nav-inner">\n                    <i class="nav-icon {{=nav.icon}}"></i>\n                    <span class="nav-text">{{=nav.text}}</span>\n                </span>\n            </a>\n        </li>\n    {{~}}',articleTmp:'{{~it:atc}}\n        <article class="article-item">\n            <div class="art-pretty">\n                <b class="art-dotts"></b>\n                <time class="art-time">\n                    {{=atc.date}}\n                </time>\n            </div>\n            <div class="art-main">\n                <a href="#article?aid={{=atc.aid}}" class="art-wrap">\n                    <div class="art-info">\n                        <h2 class="art-title">{{=atc.title}}</h2>\n                        <h3 class="art-note" title="{{=atc.preface}}">\n                            <span>{{=atc.preface}}</span>\n                        </h3>\n                    </div>\n                    <div class="art-img" style="background-image: url({{=atc.cover}})"></div>\n                </a>\n                <div class="art-meta">\n                    <a href="javascript:;" class="art-heart art-icon{{? atc.is_like }} act {{?}} mr20" data-aid="{{=atc.aid}}">\n                        <i class="heart-icon__pic"></i>\n                        <span class="heart-icon__text">喜欢(<span class="like-num">{{=atc.like_count}}</span>)</span>\n                    </a>\n                    <a href="javascript:;" class="com-icon art-comment art-icon mr20">\n                        <i class="com-icon__pic eye-icon"></i>\n                        <span class="com-icon__text">阅读({{=atc.read_count}})</span>\n                    </a>\n                    <a href="javascript:;" class="com-icon art-tag art-icon mr20">\n                        <i class="com-icon__pic tag-icon" style="background: url({{=atc.tag_url}}"></i>\n                        <span class="com-icon__text">{{=atc.tag_name}}</span>\n                    </a>\n                </div>\n            </div>\n        </article>\n    {{~}}',articleCntTmp:'\n        <div id="markdown-main" class="markdown-main com-scroll">\n            \x3c!-- 文字标题 --\x3e\n            <div class="markdown-title">\n                <h1>{{=it.title}}</h1>\n            </div>\n            \x3c!-- 文章元信息 --\x3e\n            <div class="markdown-meta">\n                <time class="com-icon meta-time mr20">\n                    <i class="com-icon__pic calendar-icon">&nbsp;</i>\n                    <span class="com-icon__text">{{=it.date}}</span>\n                </time>\n                <a href="javascript:;" class="com-icon art-heart art-icon mr20 {{? it.is_like }} act {{?}}" data-aid="ec445fbd4084316720834729">\n                    <i class="com-icon__pic heart-icon__pic"></i>\n                    <span class="com-icon__text heart-icon__text">喜欢(<span class="like-num">{{=it.like_count}}</span>)</span>\n                </a>\n                <span class="com-icon meta-like mr20">\n                    <i class="com-icon__pic eye-icon">&nbsp;</i>\n                    <span class="com-icon__text">阅读({{=it.read_count}})</span>\n                </span>\n                <a href="javascript:;" class="com-icon art-tag art-icon mr20">\n                    <i class="com-icon__pic tag-icon" style="background-image: url({{=it.tag_url}})"></i>\n                    <span class="com-icon__text">{{=it.tag_name}}</span>\n                </a>\n            </div>\n            <div class="markdown-preface">{{=it.preface}}</div>\n            <div class="markdown-cover" style="background-image: url({{=it.cover}})"></div>\n            <div class="markdown-content">{{=it.markdownHtml}}</div>\n        </div>\n        \x3c!-- 目录 --\x3e\n        <div class="markdown-catalog com-scroll">\n            <div class="markdown-catalog-title">目录</div>\n            {{=it.catalog}}\n        </div>'})},function(t,e,a){"use strict";a(3),a(4),a(5),a(6),a(11),a(13)},function(t,e,a){"use strict";new(a(0).Tooltip)({el:$("#wechat__icon"),theme:"light",content:'<img width="100" src="./assets/img/WeChat-qr-code.jpg" alt="WeChat-qr-code">'})},function(t,e,a){"use strict";var n=a(1);!function(){var t=$("#side-bar"),e=t.offset().top+t.height();$("#app").scroll(function(){$(this).scrollTop()>=e&&!t.hasClass("fixed")?t.addClass("fixed"):$(this).scrollTop()<e&&t.hasClass("fixed")&&t.removeClass("fixed")})}(),function(){for(var t=$("#hour-num"),e=$("#anchor-box"),a="",i=0;i<60;i++)a+=i%5==0?'<i class="anchor anchor-num" style="transform: rotate('+6*i+'deg);">\n                <span style="transform: rotate('+6*-i+'deg);">'+(0,n.toZero)(i)+"</span>\n            </i>":'<i class="anchor anchor-bar" style="transform: rotate('+6*i+'deg);"></i>';e.html(a);for(var o="",r=1;r<=12;r++)o+='<span class="hour-text" style="transform: rotate('+30*r+'deg);">\n                <span style="'+(r>9?"left: -9px;":"")+" transform: rotate("+30*-r+'deg);">'+r+"</span>\n            </span>";t.html(o);var s=$("#hour-hand"),c=$("#min-hand"),l=$("#sec-hand");!function t(){var e=new Date;var a=6*e.getSeconds();var n=6*e.getMinutes()+a/360*6;var i=30*(e.getHours()>11?e.getHours()-12:e.getHours())+n/360*30;s.css("transform","rotate("+i+"deg)");c.css("transform","rotate("+n+"deg)");l.css("transform","rotate("+a+"deg)");setTimeout(function(){requestAnimationFrame(t)},1e3)}()}(),function(){var t=$("#tag-box");(0,n.ajax)("/index/article/getArticleTag").then(function(e){var a="";(e.tagList||[]).forEach(function(t){a+='<a href="#article?tag='+t.tag_name+'&page=1" class="tag-item" title="'+t.tag_name+'">\n                <span class="tag-text">'+t.tag_name+"</span>\n            </a>"}),t.html(a)})}()},function(t,e,a){"use strict";var n=a(1),i=a(0),o=$("#main-box"),r=$("#app"),s=n.storage.get("scrollTop")||{};window.onhashchange=function(t){var e=t.newURL,a=t.oldURL,n=e.split("#")[1],i=a.split("#")[1];p(n,i)},$(window).on("resize.initBg",function(){var t=void 0;t=$(window).width()>1e3?"large":$(window).width()>600?"medium":"small",(0,n.picture3DSwitch)($("#intrude-bg"),[n.host+"/bg/"+t+"/bg1.jpg",n.host+"/bg/"+t+"/bg2.jpg",n.host+"/bg/"+t+"/bg3.jpg",n.host+"/bg/"+t+"/bg4.jpg"])}),setTimeout(function(){$(window).trigger("resize.initBg")},1e3),function(){function t(t,e,a,n,i){var o=n/2.5;t.beginPath();for(var r=0;r<5;r++)t.lineTo(Math.cos((18+72*r)/180*Math.PI)*n+e,-Math.sin((18+72*r)/180*Math.PI)*n+a),t.lineTo(Math.cos((54+72*r)/180*Math.PI)*o+e,-Math.sin((54+72*r)/180*Math.PI)*o+a);t.closePath(),t.fillStyle=i,t.fill()}var e=$("#canvasBg"),a=e[0].getContext("2d"),n="#6eaaff",i=[],o=$(window),r=Math.floor(o.width()/60);function s(){return Math.random()}r=r<10?10:r,e.attr({width:o.width(),height:o.height()}),function(){a.clearRect(0,0,e.attr("width"),e.attr("height"));for(var t=0;t<r;t++){var n=s()*e.attr("width");i.push({x:n,startX:n,y:s()*e.attr("height"),speedY:1,r:8*s(),xNum:0,range:40*s()})}}(),function s(){a.clearRect(0,0,e.attr("width"),e.attr("height"));for(var c=0;c<r;c++)i[c].y+=i[c].speedY,i[c].y>=o.height()+i[c].r&&(i[c].y=-i[c].r),i[c].xNum--,-360===i[c].xNum&&(i[c].xNum=0),i[c].x=i[c].startX-i[c].range*Math.sin(Math.PI/180*i[c].xNum),t(a,i[c].x,i[c].y,i[c].r,n);setTimeout(function(){requestAnimationFrame(s)},50)}()}();var c=null,l=void 0,p=function(t,e){var a=-1,p=-1;if(n.navData.forEach(function(n,i){n.reg.test(t)&&(a=i),n.reg.test(e)&&(p=i)}),a>-1){l&&l.hide();var d=new i.Loading(o).show();l=d,p>-1&&(s[n.navData[p].name]=r.scrollTop(),n.navData[p].element.empty()),n.storage.set("scrollTop",s),n.navData[a].cb((0,n.getParmasByHash)()).then(function(){d.hide()}),n.navData[a]!==n.navData[p]&&function(t,e){return new Promise(function(a){o.append(t),t.removeClass("leave").addClass("enter"),e.removeClass("enter").addClass("leave"),clearTimeout(c),c=setTimeout(function(){e.detach(),a()},500)})}(n.navData[a].element,p>=0?n.navData[p].element:$()).then(function(){var t=0;s[n.navData[a].name]&&(t=s[n.navData[a].name]),r.animate({scrollTop:t},300)})}else window.location.hash=n.navData[0].href};p(window.location.hash.substr(1)),$("#head-portrait").addClass("zoomInDown animated"),$("#intrude-info").addClass("bounceInLeft animated"),function(){var t=$("#nav-list"),e=doT.template(n.tmp.navTmp),a=n.navData.filter(function(t){return t.text});t.html(e(a));var i=$(".nav-item"),o=window.location.hash.substr(1);i.each(function(t,e){var a=$(e).data("reg").replace(/\//g,"");new RegExp(a).test(o)&&$(e).addClass("act")}),i.on("click",function(){$(this).addClass("act").siblings().removeClass("act")})}(),function(){var t=!0;o.delegate(".art-heart","click",function(){var e=this;if(t){t=!1;var a=$(this).data("aid");(0,n.ajax)("/index/article/givealike",{aid:a}).then(function(a){if(t=!0,0===a.code){$(e).addClass("act");var n=$(e).find(".like-num:first"),i=parseInt(n.text());n.text(++i)}if(1===a.code){$(e).removeClass("act");var o=$(e).find(".like-num:first"),r=parseInt(o.text());o.text(--r)}})}})}(),new i.PageUp({scroll_el:r})},function(t,e){},,,,,function(t,e){},,function(t,e){}]);