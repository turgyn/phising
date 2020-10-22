/**
 The MIT License

 Copyright (c) 2010 Daniel Park (http://metaweb.com, http://postmessage.freebaseapps.com)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 **/
var NO_JQUERY={}; (function(f,m,r){if(!("console"in f)){var p=f.console={};p.log=p.warn=p.error=p.debug=function(){}}m===NO_JQUERY&&(m={fn:{},extend:function(){for(var a=arguments[0],b=1,c=arguments.length;b<c;b++){var e=arguments[b],h;for(h in e)a[h]=e[h]}return a}});m.fn.pm=function(){console.log("usage: \nto send: $.pm(options)\nto receive: $.pm.bind(type, fn, [origin])");return this};m.pm=f.pm=function(a){c.send(a)};m.pm.bind=f.pm.bind=function(a,b,d,e){c.bind(a,b,d,e)};m.pm.unbind=f.pm.unbind=function(a,b){c.unbind(a, b)};m.pm.origin=f.pm.origin=null;m.pm.poll=f.pm.poll=200;var c={send:function(a){a=m.extend({},c.defaults,a);var b=a.target;if(a.target)if(a.type){var d={data:a.data,type:a.type};a.success&&(d.callback=c._callback(a.success));a.error&&(d.errback=c._callback(a.error));"postMessage"in b&&!a.hash?(c._bind(),b.postMessage(JSON.stringify(d),a.origin||"*")):(c.hash._bind(),c.hash.send(a,d))}else console.warn("postmessage type required");else console.warn("postmessage target window required")},bind:function(a, b,d,e){"postMessage"in f&&!e?c._bind():c.hash._bind();e=c.data("listeners.postmessage");e||(e={},c.data("listeners.postmessage",e));var h=e[a];h||(h=[],e[a]=h);h.push({fn:b,origin:d||m.pm.origin})},unbind:function(a,b){var d=c.data("listeners.postmessage");if(d)if(a)if(b){var e=d[a];if(e){for(var h=[],n=0,k=e.length;n<k;n++){var l=e[n];l.fn!==b&&h.push(l)}d[a]=h}}else delete d[a];else for(n in d)delete d[n]},data:function(a,b){return b===r?c._data[a]:c._data[a]=b},_data:{},_CHARS:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), _random:function(){for(var a=[],b=0;32>b;b++)a[b]=c._CHARS[0|32*Math.random()];return a.join("")},_callback:function(a){var b=c.data("callbacks.postmessage");b||(b={},c.data("callbacks.postmessage",b));var d=c._random();b[d]=a;return d},_bind:function(){c.data("listening.postmessage")||(f.addEventListener?f.addEventListener("message",c._dispatch,!1):f.attachEvent&&f.attachEvent("onmessage",c._dispatch),c.data("listening.postmessage",1))},_dispatch:function(a){try{var b=JSON.parse(a.data)}catch(d){console.warn("postmessage data invalid json: ", d);return}if(b.type){var e=(c.data("callbacks.postmessage")||{})[b.type];if(e)e(b.data);else for(var e=(c.data("listeners.postmessage")||{})[b.type]||[],h=0,n=e.length;h<n;h++){var k=e[h];if(k.origin&&a.origin!==k.origin)console.warn("postmessage message origin mismatch",a.origin,k.origin),b.errback&&c.send({target:a.source,data:{message:"postmessage origin mismatch",origin:[a.origin,k.origin]},type:b.errback});else try{var l=k.fn(b.data);b.callback&&c.send({target:a.source,data:l,type:b.callback})}catch(f){b.errback&& c.send({target:a.source,data:f,type:b.errback})}}}else console.warn("postmessage message type required")},hash:{send:function(a,b){var d=a.target,e=a.url;if(e){var e=c.hash._url(e),h,n=c.hash._url(f.location.href);if(f==d.parent)h="parent";else try{for(var k=0,l=parent.frames.length;k<l;k++)if(parent.frames[k]==f){h=k;break}}catch(t){h=f.name}null==h?console.warn("postmessage windows must be direct parent/child windows and the child must be available through the parent window.frames list"):(h={"x-requested-with":"postmessage", source:{name:h,url:n},postmessage:b},n="#x-postmessage-id="+c._random(),d.location=e+n+encodeURIComponent(JSON.stringify(h)))}else console.warn("postmessage target window url is required")},_regex:/^\#x\-postmessage\-id\=(\w{32})/,_regex_len:50,_bind:function(){c.data("polling.postmessage")||(setInterval(function(){var a=""+f.location.hash,b=c.hash._regex.exec(a);b&&(b=b[1],c.hash._last!==b&&(c.hash._last=b,c.hash._dispatch(a.substring(c.hash._regex_len))))},m.pm.poll||200),c.data("polling.postmessage", 1))},_dispatch:function(a){if(a){try{if(a=JSON.parse(decodeURIComponent(a)),!("postmessage"===a["x-requested-with"]&&a.source&&null!=a.source.name&&a.source.url&&a.postmessage))return}catch(b){return}var d=a.postmessage,e=(c.data("callbacks.postmessage")||{})[d.type];if(e)e(d.data);else for(var e="parent"===a.source.name?f.parent:f.frames[a.source.name],h=(c.data("listeners.postmessage")||{})[d.type]||[],n=0,k=h.length;n<k;n++){var l=h[n];if(l.origin){var t=/https?\:\/\/[^\/]*/.exec(a.source.url)[0]; if(t!==l.origin){console.warn("postmessage message origin mismatch",t,l.origin);d.errback&&c.send({target:e,data:{message:"postmessage origin mismatch",origin:[t,l.origin]},type:d.errback,hash:!0,url:a.source.url});continue}}try{var m=l.fn(d.data);d.callback&&c.send({target:e,data:m,type:d.callback,hash:!0,url:a.source.url})}catch(s){d.errback&&c.send({target:e,data:s,type:d.errback,hash:!0,url:a.source.url})}}}},_url:function(a){return(""+a).replace(/#.*$/,"")}}};m.extend(c,{defaults:{target:null, url:null,type:null,data:null,success:null,error:null,origin:"*",hash:!1}})})(this,"undefined"===typeof jQuery?NO_JQUERY:jQuery);"JSON"in window&&window.JSON||(JSON={}); (function(){function f(a){return 10>a?"0"+a:a}function m(a){c.lastIndex=0;return c.test(a)?'"'+a.replace(c,function(a){var b=d[a];return"string"===typeof b?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function r(c,d){var k,l,f,p,s=a,q,g=d[c];g&&"object"===typeof g&&"function"===typeof g.toJSON&&(g=g.toJSON(c));"function"===typeof e&&(g=e.call(d,c,g));switch(typeof g){case "string":return m(g);case "number":return isFinite(g)?String(g):"null";case "boolean":case "null":return String(g); case "object":if(!g)return"null";a+=b;q=[];if("[object Array]"===Object.prototype.toString.apply(g)){p=g.length;for(k=0;k<p;k+=1)q[k]=r(k,g)||"null";f=0===q.length?"[]":a?"[\n"+a+q.join(",\n"+a)+"\n"+s+"]":"["+q.join(",")+"]";a=s;return f}if(e&&"object"===typeof e)for(p=e.length,k=0;k<p;k+=1)l=e[k],"string"===typeof l&&(f=r(l,g))&&q.push(m(l)+(a?": ":":")+f);else for(l in g)Object.hasOwnProperty.call(g,l)&&(f=r(l,g))&&q.push(m(l)+(a?": ":":")+f);f=0===q.length?"{}":a?"{\n"+a+q.join(",\n"+a)+"\n"+ s+"}":"{"+q.join(",")+"}";a=s;return f}}"function"!==typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(a){return this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z"},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var p=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, c=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,a,b,d={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},e;"function"!==typeof JSON.stringify&&(JSON.stringify=function(c,d,f){var l;b=a="";if("number"===typeof f)for(l=0;l<f;l+=1)b+=" ";else"string"===typeof f&&(b=f);if((e=d)&&"function"!==typeof d&&("object"!==typeof d||"number"!==typeof d.length))throw Error("JSON.stringify");return r("",{"":c})}); "function"!==typeof JSON.parse&&(JSON.parse=function(a,b){function c(a,d){var e,f,g=a[d];if(g&&"object"===typeof g)for(e in g)Object.hasOwnProperty.call(g,e)&&(f=c(g,e),void 0!==f?g[e]=f:delete g[e]);return b.call(a,d,g)}var d;p.lastIndex=0;p.test(a)&&(a=a.replace(p,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))return d=eval("("+a+")"),"function"===typeof b?c({"":d},""):d;throw new SyntaxError("JSON.parse");})})();var RC={fields:{},validators:{1:"checkEqually",2:"checkNotEqually",3:"checkContains",4:"checkNotContains",5:"checkBeginWith",6:"checkEndWith",7:"checkIsGreatherThan",8:"checkIsLessThan"},getField:function(a){this.fields[a]||(this.fields[a]=$(a));return this.fields[a]},inArray:function(a,b){for(var c in b)if(a==b[c])return!0;return!1},pregQuote:function(a){return(a+"").replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}=!<>\|:])/g,"\\$1")},compareStrings:function(a,b){if(!a.length||!b.length)return a.length-b.length;
                var c=/([^\d]+|\d+)/ig,g=a.toString().match(c);c=b.toString().match(c);for(var d=0,h=Math.min(g.length,c.length);d<h;d++){var e=g[d],f=c[d];if(e!==f)return isNaN(+e)||isNaN(+f)?e>f?1:-1:+e-f}return g.length-c.length},checkEqually:function(a,b){return a==b},checkNotEqually:function(a,b){return a!=b},checkContains:function(a,b){return(new RegExp(this.pregQuote(b),"gi")).test(a)},checkNotContains:function(a,b){return!this.checkContains(a,b)},checkBeginWith:function(a,b){return(new RegExp("^"+this.pregQuote(b),
            "gi")).test(a)},checkEndWith:function(a,b){return(new RegExp(this.pregQuote(b)+"$","gi")).test(a)},checkIsGreatherThan:function(a,b){return this.isNumber(a)&&this.isNumber(b)?+a>+b:0<this.compareStrings(a,b)},checkIsLessThan:function(a,b){return this.isNumber(a)&&this.isNumber(b)?+a<+b:0>this.compareStrings(a,b)},isNumber:function(a){return/^[\d\.]+$/.test(a)}};Object.keys||(Object.keys=function(){return function(a){var b=[],d;for(d in a)b.push(d);return b}}());function setAutoFrameHeight(a,b){b.id=a;pm({target:window.parent,type:a,data:b})}
function parseGetParams(){var a,b,d,f,e={},c=function(g){return decodeURIComponent(g).replace(/\+/g," ")},l=window.location.search.substring(1),m=/([^&;=]+)=?([^&;]*)/g;for(f=function(g){"object"!=typeof g&&(a=g,g={length:0},a&&Array.prototype.push.call(g,a));return g};b=m.exec(l);){var h=b[1].indexOf("[");var k=c(b[2]);0>h?(d=c(b[1]),e[d]?(e[d]=f(e[d]),Array.prototype.push.call(e[d],k)):e[d]=k):(d=c(b[1].slice(0,h)),h=c(b[1].slice(h+1,b[1].indexOf("]",h))),e[d]=f(e[d]),h?e[d][h]=k:Array.prototype.push.call(e[d],
    k))}return e}
function setField(a,b){var d=RC.getField("[data-name="+a+"]");d.length||(d=RC.getField("[name^="+a+"]"));debug("setField",a,b,d);d.each(function(f){var e=!1,c=$(this);if(c.is(":radio")||c.is(":checkbox")){var l=c.next().text().trim();$.isArray(b)&&-1!=$.inArray(l,b)?(c.prop("checked",!0).parent(".unit").addClass("unit_checked"),e=!0):$.isPlainObject(b)?$.each(b,function(h,k){if(k==l)return c.prop("checked",!0).parent(".unit").addClass("unit_checked"),e=!0,!1}):l==b&&(c.prop("checked",!0).parent(".unit").addClass("unit_checked"),
    e=!0)}else if(c.hasClass("autocomplete")){if($.isArray(b)){var m=[];$.each(b,function(h,k){var g=$("<option></option>");g.val(k);g.text(k);g.prop("selected",!0);m.push(g)});c.html(m)}else f=$("<option></option>"),f.val(b),f.text(b),f.prop("selected",!0),c.html(f);e=!0}else c.hasClass("rangeslider__input")?(c.val(b),setTimeout(function(){c.parents(".rangeslider").rangeSlider("set",b)},100),e=!0):c.hasClass("star-rating__value")?(setTimeout(function(){c.parents(".star-rating").FDRating("set",b)},0),
    e=!0):c.hasClass("messenger")?(setTimeout(function(){c.FDMessenger("set",b)},0),e=!0):c.is("select")?(f=c.find('option:contains("'+b+'")'),f.size()&&(f.prop("selected",!0).siblings().prop("selected",!1),e=!0)):$.isArray(b)?b[f]&&(c.val(b[f]),e=!0):$.isPlainObject(b)?b[f]&&(c.val(b[f]),e=!0):(c.val(b),e=""!==b&&null!==b);e&&c.parents(".floatLabel").addClass("hasValue")});d.eq(0).trigger("change")}var $pageurl=$("#pageurl"),$referrer=$("#referrer"),iframeId,getParams=parseGetParams();
function debug(){1==getParams.debug&&console.log.apply(console,arguments)}$.each(getParams,function(a,b){setField(a,b)});"undefined"!=typeof getParams.title&&$("h3:eq(0)").text(getParams.title);
if(window.top.location===window.location)$pageurl.val(window.location.href),$referrer.val(document.referrer);else{$pageurl.val(document.referrer);getParams.referrer&&$referrer.val(getParams.referrer);if(/^((?!chrome|android).)*safari/i.test(navigator.userAgent)){var $sid=$("input[name=sid]"),$form=$sid.parents("form"),action=$form.attr("action");$sid.length&&-1==action.indexOf("sid=")&&$form.attr("action",action+(0<action.indexOf("?")?"&sid=":"?sid=")+$sid.val())}pm.bind("setdata",function(a){a.url&&
$pageurl.val(a.url);a.referrer&&$referrer.val(a.referrer);if(a.fields)for(var b in a.fields)setField(b,a.fields[b]);"undefined"!=typeof a.title&&$("h3:eq(0)").text(a.title)});pm.bind("register",function(a){var b=$("body"),d=$("#pr"),f=d.outerWidth(!0);setAutoFrameHeight(a.id,{height:Math.max(b.outerHeight(!0),d.outerHeight(!0)),width:f,success:b.data("success")});a.clientId&&($('<input type="hidden" name="gaClientId"/>').val(a.clientId).insertAfter($referrer),debug("set gaClientId",a.clientId));a.yaClientId&&
($('<input type="hidden" name="yaClientId"/>').val(a.yaClientId).insertAfter($referrer),debug("set yaClientId",a.clientId));$pageurl.val(a.url);$referrer.val(a.referrer);iframeId=a.id;if(a.fields)for(var e in a.fields)setField(e,a.fields[e]);"undefined"!=typeof a.title&&$("h3:eq(0)").text(a.title);window.setInterval(function(){setAutoFrameHeight(a.id,{height:Math.max(b.outerHeight(!0),d.outerHeight(!0)),width:d.outerWidth(!0),success:!1})},100);getParams.popup&&(b.on("click",function(c){$(c.target).is("body")&&
pm({target:window.parent,type:a.id,data:{closePopup:1,id:a.id}})}),a.height&&a.width&&a.width<=f&&414>=a.width?d.css("min-height",a.height):d.css("min-height",0))})};function getCookie(a){return(a=document.cookie.match(new RegExp("(?:^|; )"+a.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)")))?decodeURIComponent(a[1]):void 0}function setCookie(a,d,b){b=b||{};var c=b.expires;if("number"==typeof c&&c){var e=new Date;e.setTime(e.getTime()+1E3*c);c=b.expires=e}c&&c.toUTCString&&(b.expires=c.toUTCString());d=encodeURIComponent(d);a=a+"="+d;for(var f in b)a+="; "+f,d=b[f],!0!==d&&(a+="="+d);document.cookie=a};window.submitFormCallbacks||(window.submitFormCallbacks=[]);function addSubmitFormCallback(b,a){a?window.submitFormCallbacks.unshift(b):window.submitFormCallbacks.push(b)}$(function(){RC.getField('.form').on("submit",function(b){for(var a=$(this),d=window.submitFormCallbacks.length,c=0;c<d;c++){var e=window.submitFormCallbacks[c];try{if(!1===e(a,b))return!1}catch(f){console.error(f)}}"_blank"!=a.prop("target")&&a.parents(".mainForm").addClass("processing");debug("submit")})});var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.arrayIteratorImpl=function(h){var g=0;return function(){return g<h.length?{done:!1,value:h[g++]}:{done:!0}}};$jscomp.arrayIterator=function(h){return{next:$jscomp.arrayIteratorImpl(h)}};$jscomp.makeIterator=function(h){var g="undefined"!=typeof Symbol&&Symbol.iterator&&h[Symbol.iterator];return g?g.call(h):$jscomp.arrayIterator(h)};
(function(h,g){function u(a,b){var e=b.data("name"),f=b.attr("name").replace(/(\[.*?\])/,""),l=b.data("id");if(e&&f&&l){var c=x(a);g.app.data[e]=c.data;g.app.data[f]=c.data;g.app.items[l]=c.items}}function x(a){var b={data:[],items:[]};if(a.is(".type-file")){var e=a.find(":file")[0].files,f=e.length;if(f)for(var l=0;l<f;l++)b.data.push(e[l].name.replace(/.+[\\\/]/,""));else b.data.push(p(a.find(".file-name").text()));b.items=b.data}else{var c="";a.find("input, select, textarea").each(function(){var d=
    h(this);if(a.hasClass("type-radio")||a.hasClass("type-checkbox"))d.is(":checked")&&(c=d.val(),b.data.push(p("-1"===c?d.next().next().val().trim():d.next().text().trim())),b.items.push(c));else if(d.is("select"))b.data.push(p(d.find(":selected").text())),b.items.push(d.val());else if(d.is("textarea"))c=p(d.val().trim()),""!==c&&b.data.push(c.replace(/[\r\n]/g,"<br>")),b.items=b.data;else if(d.hasClass("calculation")){if(c=d.val().trim(),""!==c){b.data.push(c);var m=d.data("suffix");m&&(c=c.replace(m,
    ""));(m=d.data("prefix"))&&(c=c.replace(m,""));(d=d.data("separator"))&&(c=c.replace(d,""));b.items.push(y(c))}}else if(d.hasClass("date")){if(c=d.val().trim(),""!==c){b.data.push(c);b.items.push(c);var k=d.data("format2");if("yyyy-mm-dd"!==k){d=k.indexOf("yyyy");m=k.indexOf("mm");var z=k.indexOf("dd");k=k.indexOf("H");var q=c.toString(),r=0,t=0;-1!==k&&(r=q.substr(k,2),0>r&&(r=0),t=q.substr(k+3,2),0>t&&(t=0));c=(new Date(q.substr(d,4),q.substr(m,2)-1,q.substr(z,2),r,t,0,0)).getTime()}else c=Date.parse(c);
    b.items.push(c/1E3)}}else c=d.val().trim(),""!==c&&(c=a.hasClass("type-signature")?'<img src="'+c+'" alt="">':p(c),b.data.push(c)),b.items=b.data})}return b}function p(a){return a.toString().replace(/<[^>]+>/gi,"")}function y(a){a&&(a=a.toString().replace(/,/g,"."),a=a.replace(/[^\d\.\-]+/g,""),a=a.replace(/(^\.+|\.+$)/g,""));return a}function A(a,b){n[a]||(n[a]=[]);n[a].push(b)}function B(a){!n[a]||1>n[a].length||n[a].forEach(function(b){b()})}function C(a,b,e){Object.defineProperty(a,b,{get:function(){return e},
    set:function(f){e=f;B(b)}})}function D(a,b,e,f){a.innerHTML=(b[e]||[]).join(f);A(e,function(){a.innerHTML=(b[e]||[]).join("\\r\\n"==f?"<br>":f)})}function v(a,b){if(0<a.children.length)for(var e=$jscomp.makeIterator(a.children),f=e.next();!f.done;f=e.next())v(f.value,b);else a.attributes.hasOwnProperty("s-text")&&D(a,b,a.attributes["s-text"].value,a.attributes.hasOwnProperty("s-separator")?a.attributes["s-separator"].value:" ")}var n={};g.app||(g.app={items:{},data:{}});var w=RC.getField(".form");
    w.find(".shift").each(function(){var a=h(this),b=a.find("input,select,textarea").eq(0);b.length&&u(a,b)});w.on("change keyup",function(a){a=h(a.target);var b=a.parents(".shift");u(b,a);a.trigger("fd.calculate")});(function(a){for(var b in a)a.hasOwnProperty(b)&&C(a,b,a[b]);h(".shift, .errorSummary li").each(function(){v(this,a)})})(g.app.data);window.getValueByName=function(a){return g.app.data[a]||[]};window.getValueByItemId=function(a){return g.app.items[a]||[]}})(jQuery,window);(function(b){b(function(){var c={};b("input[placeholder]").each(function(){var a=b(this),d=a.attr("placeholder").match(/\{([^\}]+)\}/);d&&d[1]&&(c[d[1]]=a,a.attr("placeholder",getValueByName(d[1])))});if(Object.keys(c).length)RC.getField(".form").on("change keyup",function(a){a=b(a.target).data("name");c[a]&&c[a].attr("placeholder",getValueByName(a))})})})(jQuery);$(function(){var $pages = RC.getField('.pages'), $page = $pages.find('.page'), prev = $('.prev'), next = $('.next'), $buttons = $('.btn'), $submit = $(':submit', $buttons), $currPageInput = $('#current_page'), currPageIndex = $page.index($pages.find('.current'))+1, totalPages = $page.length; var PagesStorage = { pages: {}, get: function(id) { if (!this.pages[id]) { this.pages[id] = $('#page_' + id); } return this.pages[id]; } }; if (!window.changePageStepHandlers) { window.changePageStepHandlers = []; } if (window.setTooltip) { window.changePageStepHandlers.push(function(currPageIndex, pageId, totalPages) { var $current = PagesStorage.get(pageId); if (!$current.data('tooltip')) { window.setTooltip($current.find('.tooltip')); $current.data('tooltip', true); } }); } $('.text, :radio, :checkbox').on('keypress', function(e) { if (e.which == 13 && currPageIndex < totalPages && !$(this).is('textarea') && next.is(':visible')) { $('.page.current .next').trigger('click'); return false; } }); $('.nav').on('click', function(){ var $current = $pages.find('.current'); var curPageId = $current.data('id'); var prevIds = $pages.data('prev') || []; var nextIds = $pages.data('next') || []; if ($(this).val() == 'next') { prevIds.push(curPageId); $pages.data('prev', prevIds); var nextPageId = nextIds.shift(); $pages.data('next', nextIds); if (nextPageId && nextPageId != curPageId) { $current.removeClass('current'); $current = PagesStorage.get(nextPageId); currPageIndex = $page.index($current)+1; } else { currPageIndex++; $current = $current.removeClass('current').next(); while(!$current.find('.shift:not(.hide,.btn)').length) { if (currPageIndex >= totalPages) { break; } $current = $current.next(); currPageIndex++; } } $current.addClass('current'); if (currPageIndex >= totalPages) { } } else{ var prevPageId = prevIds.pop(); $pages.data('prev', prevIds); nextIds.unshift($current.data('id')); $pages.data('next', nextIds); if (prevPageId) { $current.removeClass('current'); $current = PagesStorage.get(prevPageId); currPageIndex = $page.index($current)+1; } else { currPageIndex--; $current = $current.removeClass('current').prev(); while(!$current.find('.shift:not(.hide,.btn)').length) { if (currPageIndex <= 1) { break; } $current = $current.prev(); currPageIndex--; } } $current.addClass('current'); } var pageId = $current.data('id'); $currPageInput.val(pageId); executePageStepHandlers(currPageIndex, pageId, totalPages); if (iframeId) { pm({ target: window.parent, type: iframeId, data: {scrollTop: 20, id: iframeId} }); } else { $("html, body").animate({scrollTop:0}, 500); } }); function executePageStepHandlers(currPageIndex, pageId, totalPages) { var countHandlers = window.changePageStepHandlers.length; var i = 0; for (i; i < countHandlers; i++) { var handler = window.changePageStepHandlers[i]; handler(currPageIndex, pageId, totalPages) } } var $captcha = $('#asciiCaptcha'); if ($captcha.length) { $(document).on('click', '#asciiCaptcha', function(){ loadCaptcha(true); return false; }); function loadCaptcha(refresh){ var name = $captcha.data('name'); var sid = $('input[name="' + name + '"]'); $.getJSON($captcha.data('url') + '?'+(sid.length ? name +'='+sid.val()+'&': '')+(typeof refresh != 'undefined' ? 'refresh=1&': '')+'callback=?', function(response){ $captcha.html(response.html); }); } loadCaptcha(); }});