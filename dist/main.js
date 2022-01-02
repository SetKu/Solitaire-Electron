(()=>{"use strict";var e={614:(e,r,t)=>{var n;t.r(r),t.d(r,{NIL:()=>T,parse:()=>g,stringify:()=>d,v1:()=>p,v3:()=>U,v4:()=>S,v5:()=>D,validate:()=>i,version:()=>L});var s=new Uint8Array(16);function o(){if(!n&&!(n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(s)}const a=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,i=function(e){return"string"==typeof e&&a.test(e)};for(var c=[],u=0;u<256;++u)c.push((u+256).toString(16).substr(1));const d=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,t=(c[e[r+0]]+c[e[r+1]]+c[e[r+2]]+c[e[r+3]]+"-"+c[e[r+4]]+c[e[r+5]]+"-"+c[e[r+6]]+c[e[r+7]]+"-"+c[e[r+8]]+c[e[r+9]]+"-"+c[e[r+10]]+c[e[r+11]]+c[e[r+12]]+c[e[r+13]]+c[e[r+14]]+c[e[r+15]]).toLowerCase();if(!i(t))throw TypeError("Stringified UUID is invalid");return t};var l,f,h=0,v=0;const p=function(e,r,t){var n=r&&t||0,s=r||new Array(16),a=(e=e||{}).node||l,i=void 0!==e.clockseq?e.clockseq:f;if(null==a||null==i){var c=e.random||(e.rng||o)();null==a&&(a=l=[1|c[0],c[1],c[2],c[3],c[4],c[5]]),null==i&&(i=f=16383&(c[6]<<8|c[7]))}var u=void 0!==e.msecs?e.msecs:Date.now(),p=void 0!==e.nsecs?e.nsecs:v+1,g=u-h+(p-v)/1e4;if(g<0&&void 0===e.clockseq&&(i=i+1&16383),(g<0||u>h)&&void 0===e.nsecs&&(p=0),p>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");h=u,v=p,f=i;var m=(1e4*(268435455&(u+=122192928e5))+p)%4294967296;s[n++]=m>>>24&255,s[n++]=m>>>16&255,s[n++]=m>>>8&255,s[n++]=255&m;var y=u/4294967296*1e4&268435455;s[n++]=y>>>8&255,s[n++]=255&y,s[n++]=y>>>24&15|16,s[n++]=y>>>16&255,s[n++]=i>>>8|128,s[n++]=255&i;for(var w=0;w<6;++w)s[n+w]=a[w];return r||d(s)},g=function(e){if(!i(e))throw TypeError("Invalid UUID");var r,t=new Uint8Array(16);return t[0]=(r=parseInt(e.slice(0,8),16))>>>24,t[1]=r>>>16&255,t[2]=r>>>8&255,t[3]=255&r,t[4]=(r=parseInt(e.slice(9,13),16))>>>8,t[5]=255&r,t[6]=(r=parseInt(e.slice(14,18),16))>>>8,t[7]=255&r,t[8]=(r=parseInt(e.slice(19,23),16))>>>8,t[9]=255&r,t[10]=(r=parseInt(e.slice(24,36),16))/1099511627776&255,t[11]=r/4294967296&255,t[12]=r>>>24&255,t[13]=r>>>16&255,t[14]=r>>>8&255,t[15]=255&r,t};function m(e,r,t){function n(e,n,s,o){if("string"==typeof e&&(e=function(e){e=unescape(encodeURIComponent(e));for(var r=[],t=0;t<e.length;++t)r.push(e.charCodeAt(t));return r}(e)),"string"==typeof n&&(n=g(n)),16!==n.length)throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");var a=new Uint8Array(16+e.length);if(a.set(n),a.set(e,n.length),(a=t(a))[6]=15&a[6]|r,a[8]=63&a[8]|128,s){o=o||0;for(var i=0;i<16;++i)s[o+i]=a[i];return s}return d(a)}try{n.name=e}catch(e){}return n.DNS="6ba7b810-9dad-11d1-80b4-00c04fd430c8",n.URL="6ba7b811-9dad-11d1-80b4-00c04fd430c8",n}function y(e){return 14+(e+64>>>9<<4)+1}function w(e,r){var t=(65535&e)+(65535&r);return(e>>16)+(r>>16)+(t>>16)<<16|65535&t}function _(e,r,t,n,s,o){return w((a=w(w(r,e),w(n,o)))<<(i=s)|a>>>32-i,t);var a,i}function b(e,r,t,n,s,o,a){return _(r&t|~r&n,e,r,s,o,a)}function k(e,r,t,n,s,o,a){return _(r&n|t&~n,e,r,s,o,a)}function A(e,r,t,n,s,o,a){return _(r^t^n,e,r,s,o,a)}function M(e,r,t,n,s,o,a){return _(t^(r|~n),e,r,s,o,a)}const U=m("v3",48,(function(e){if("string"==typeof e){var r=unescape(encodeURIComponent(e));e=new Uint8Array(r.length);for(var t=0;t<r.length;++t)e[t]=r.charCodeAt(t)}return function(e){for(var r=[],t=32*e.length,n="0123456789abcdef",s=0;s<t;s+=8){var o=e[s>>5]>>>s%32&255,a=parseInt(n.charAt(o>>>4&15)+n.charAt(15&o),16);r.push(a)}return r}(function(e,r){e[r>>5]|=128<<r%32,e[y(r)-1]=r;for(var t=1732584193,n=-271733879,s=-1732584194,o=271733878,a=0;a<e.length;a+=16){var i=t,c=n,u=s,d=o;t=b(t,n,s,o,e[a],7,-680876936),o=b(o,t,n,s,e[a+1],12,-389564586),s=b(s,o,t,n,e[a+2],17,606105819),n=b(n,s,o,t,e[a+3],22,-1044525330),t=b(t,n,s,o,e[a+4],7,-176418897),o=b(o,t,n,s,e[a+5],12,1200080426),s=b(s,o,t,n,e[a+6],17,-1473231341),n=b(n,s,o,t,e[a+7],22,-45705983),t=b(t,n,s,o,e[a+8],7,1770035416),o=b(o,t,n,s,e[a+9],12,-1958414417),s=b(s,o,t,n,e[a+10],17,-42063),n=b(n,s,o,t,e[a+11],22,-1990404162),t=b(t,n,s,o,e[a+12],7,1804603682),o=b(o,t,n,s,e[a+13],12,-40341101),s=b(s,o,t,n,e[a+14],17,-1502002290),t=k(t,n=b(n,s,o,t,e[a+15],22,1236535329),s,o,e[a+1],5,-165796510),o=k(o,t,n,s,e[a+6],9,-1069501632),s=k(s,o,t,n,e[a+11],14,643717713),n=k(n,s,o,t,e[a],20,-373897302),t=k(t,n,s,o,e[a+5],5,-701558691),o=k(o,t,n,s,e[a+10],9,38016083),s=k(s,o,t,n,e[a+15],14,-660478335),n=k(n,s,o,t,e[a+4],20,-405537848),t=k(t,n,s,o,e[a+9],5,568446438),o=k(o,t,n,s,e[a+14],9,-1019803690),s=k(s,o,t,n,e[a+3],14,-187363961),n=k(n,s,o,t,e[a+8],20,1163531501),t=k(t,n,s,o,e[a+13],5,-1444681467),o=k(o,t,n,s,e[a+2],9,-51403784),s=k(s,o,t,n,e[a+7],14,1735328473),t=A(t,n=k(n,s,o,t,e[a+12],20,-1926607734),s,o,e[a+5],4,-378558),o=A(o,t,n,s,e[a+8],11,-2022574463),s=A(s,o,t,n,e[a+11],16,1839030562),n=A(n,s,o,t,e[a+14],23,-35309556),t=A(t,n,s,o,e[a+1],4,-1530992060),o=A(o,t,n,s,e[a+4],11,1272893353),s=A(s,o,t,n,e[a+7],16,-155497632),n=A(n,s,o,t,e[a+10],23,-1094730640),t=A(t,n,s,o,e[a+13],4,681279174),o=A(o,t,n,s,e[a],11,-358537222),s=A(s,o,t,n,e[a+3],16,-722521979),n=A(n,s,o,t,e[a+6],23,76029189),t=A(t,n,s,o,e[a+9],4,-640364487),o=A(o,t,n,s,e[a+12],11,-421815835),s=A(s,o,t,n,e[a+15],16,530742520),t=M(t,n=A(n,s,o,t,e[a+2],23,-995338651),s,o,e[a],6,-198630844),o=M(o,t,n,s,e[a+7],10,1126891415),s=M(s,o,t,n,e[a+14],15,-1416354905),n=M(n,s,o,t,e[a+5],21,-57434055),t=M(t,n,s,o,e[a+12],6,1700485571),o=M(o,t,n,s,e[a+3],10,-1894986606),s=M(s,o,t,n,e[a+10],15,-1051523),n=M(n,s,o,t,e[a+1],21,-2054922799),t=M(t,n,s,o,e[a+8],6,1873313359),o=M(o,t,n,s,e[a+15],10,-30611744),s=M(s,o,t,n,e[a+6],15,-1560198380),n=M(n,s,o,t,e[a+13],21,1309151649),t=M(t,n,s,o,e[a+4],6,-145523070),o=M(o,t,n,s,e[a+11],10,-1120210379),s=M(s,o,t,n,e[a+2],15,718787259),n=M(n,s,o,t,e[a+9],21,-343485551),t=w(t,i),n=w(n,c),s=w(s,u),o=w(o,d)}return[t,n,s,o]}(function(e){if(0===e.length)return[];for(var r=8*e.length,t=new Uint32Array(y(r)),n=0;n<r;n+=8)t[n>>5]|=(255&e[n/8])<<n%32;return t}(e),8*e.length))})),S=function(e,r,t){var n=(e=e||{}).random||(e.rng||o)();if(n[6]=15&n[6]|64,n[8]=63&n[8]|128,r){t=t||0;for(var s=0;s<16;++s)r[t+s]=n[s];return r}return d(n)};function C(e,r,t,n){switch(e){case 0:return r&t^~r&n;case 1:case 3:return r^t^n;case 2:return r&t^r&n^t&n}}function I(e,r){return e<<r|e>>>32-r}const D=m("v5",80,(function(e){var r=[1518500249,1859775393,2400959708,3395469782],t=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof e){var n=unescape(encodeURIComponent(e));e=[];for(var s=0;s<n.length;++s)e.push(n.charCodeAt(s))}else Array.isArray(e)||(e=Array.prototype.slice.call(e));e.push(128);for(var o=e.length/4+2,a=Math.ceil(o/16),i=new Array(a),c=0;c<a;++c){for(var u=new Uint32Array(16),d=0;d<16;++d)u[d]=e[64*c+4*d]<<24|e[64*c+4*d+1]<<16|e[64*c+4*d+2]<<8|e[64*c+4*d+3];i[c]=u}i[a-1][14]=8*(e.length-1)/Math.pow(2,32),i[a-1][14]=Math.floor(i[a-1][14]),i[a-1][15]=8*(e.length-1)&4294967295;for(var l=0;l<a;++l){for(var f=new Uint32Array(80),h=0;h<16;++h)f[h]=i[l][h];for(var v=16;v<80;++v)f[v]=I(f[v-3]^f[v-8]^f[v-14]^f[v-16],1);for(var p=t[0],g=t[1],m=t[2],y=t[3],w=t[4],_=0;_<80;++_){var b=Math.floor(_/20),k=I(p,5)+C(b,g,m,y)+w+r[b]+f[_]>>>0;w=y,y=m,m=I(g,30)>>>0,g=p,p=k}t[0]=t[0]+p>>>0,t[1]=t[1]+g>>>0,t[2]=t[2]+m>>>0,t[3]=t[3]+y>>>0,t[4]=t[4]+w>>>0}return[t[0]>>24&255,t[0]>>16&255,t[0]>>8&255,255&t[0],t[1]>>24&255,t[1]>>16&255,t[1]>>8&255,255&t[1],t[2]>>24&255,t[2]>>16&255,t[2]>>8&255,255&t[2],t[3]>>24&255,t[3]>>16&255,t[3]>>8&255,255&t[3],t[4]>>24&255,t[4]>>16&255,t[4]>>8&255,255&t[4]]})),T="00000000-0000-0000-0000-000000000000",L=function(e){if(!i(e))throw TypeError("Invalid UUID");return parseInt(e.substr(14,1),16)}}},r={};function t(n){var s=r[n];if(void 0!==s)return s.exports;var o=r[n]={exports:{}};return e[n](o,o.exports,t),o.exports}t.d=(e,r)=>{for(var n in r)t.o(r,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:r[n]})},t.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),t.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{let e=t(614);var r,n,s,o=document.querySelector(".game__stock-cloth__revealed-cards"),a=document.querySelector(".game__working-cloth__piles"),i=(document.querySelector(".game__foundation-cloth"),document.querySelector(".game__foundation-cloth__spades")),c=document.querySelector(".game__foundation-cloth__clubs"),u=document.querySelector(".game__foundation-cloth__hearts"),d=document.querySelector(".game__foundation-cloth__diamonds");!function(e){e.black="black",e.red="red"}(r||(r={})),function(e){e.spades="spades",e.clubs="clubs",e.hearts="hearts",e.diamonds="diamonds"}(n||(n={})),function(e){e.ace="A",e.two="2",e.three="3",e.four="4",e.five="5",e.six="6",e.seven="7",e.eight="8",e.nine="9",e.ten="10",e.jack="J",e.queen="Q",e.king="K"}(s||(s={}));class l{constructor(e){this.cards=e}shuffled(){for(var e=this.cards.length-1;e>0;e--){const r=Math.floor(Math.random()*(e+1));[this.cards[e],this.cards[r]]=[this.cards[r],this.cards[e]]}return this}static newDeck(){let e=[];for(const r of Object.values(n))for(const t of Object.values(s))e.push(new f(r,t));return new l(e)}}class f{constructor(r,t){this.suit=r,this.value=t,this.id=e.v4()}get html(){return`<div class="card ${this.cardColor}" id="${this.id}">\n      <div class="card__top-left">\n        <div class="card__corner-value">${this.value}</div>\n        <img src="./media/${this.suit}.svg" class="card__corner-suit">\n      </div>\n      <div class="card__bottom-right">\n        <div class="card__corner-value">${this.value}</div>\n        <img src="./media/${this.suit}.svg" class="card__corner-suit">\n      </div>\n    </div>`}get cardColor(){switch(this.suit){case n.spades||n.clubs:return r.black;case n.diamonds||n.hearts:return r.red}}}f.faceDownHTML='<div class="card--face-down"></div>';class h{constructor(r){this.suit=r,this.id=e.v4()}get html(){return`<div class="card--suit-placeholder"><img src="./media/${this.suit}.svg"></div>`}}function v(e){switch(e){case"spades":return i;case"clubs":return c;case"hearts":return u;case"diamonds":return d}}function p(){const e=document.getElementsByClassName("pile");for(let r=0;r<e.length;r++){let t=e.item(r);for(let e=0;e<t.children.length;e++){let r=t.children[e];0!=e&&r.setAttribute("style",`transform: translateY(-${5.5*e}rem);`)}}}h.spades=new h(n.spades),h.clubs=new h(n.clubs),h.hearts=new h(n.hearts),h.diamonds=new h(n.diamonds),p();let g=new class{constructor(){this.resetState()}resetState(){this.stockDeck=l.newDeck().shuffled(),this.stockRevealedCards=[];let e=[];for(let t=1;t<8;t++){var r=[];for(let e=0;e<t;e++)r.push(this.stockDeck.cards.pop());e.push(r)}this.workingPiles=e,this.foundationDecks={spades:new Array,clubs:new Array,hearts:new Array,diamonds:new Array}}forceUpdateUI(){o.innerHTML="",this.stockRevealedCards.forEach((e=>{o.innerHTML+=e.html+"\n"}));for(let e=0;e<7;e++){const r=a.children[e];r.innerHTML="";const t=this.workingPiles[e];for(let e=0;e<t.length;e++)e==t.length-1?r.innerHTML+=t[e].html:r.innerHTML+=f.faceDownHTML}p();for(const e in this.foundationDecks)0!=this.foundationDecks[e].length?v(e).innerHTML=this.foundationDecks[e][this.foundationDecks[e].length-1].innerHTML:v(e).innerHTML=h[e]}};new Proxy(g,{set:(e,r,t)=>(e[r]=t,!0)})})()})();