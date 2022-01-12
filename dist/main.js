(()=>{"use strict";var e={614:(e,t,n)=>{var r;n.r(t),n.d(t,{NIL:()=>S,parse:()=>p,stringify:()=>d,v1:()=>m,v3:()=>E,v4:()=>C,v5:()=>I,validate:()=>i,version:()=>T});var o=new Uint8Array(16);function s(){if(!r&&!(r="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return r(o)}const a=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,i=function(e){return"string"==typeof e&&a.test(e)};for(var c=[],l=0;l<256;++l)c.push((l+256).toString(16).substr(1));const d=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=(c[e[t+0]]+c[e[t+1]]+c[e[t+2]]+c[e[t+3]]+"-"+c[e[t+4]]+c[e[t+5]]+"-"+c[e[t+6]]+c[e[t+7]]+"-"+c[e[t+8]]+c[e[t+9]]+"-"+c[e[t+10]]+c[e[t+11]]+c[e[t+12]]+c[e[t+13]]+c[e[t+14]]+c[e[t+15]]).toLowerCase();if(!i(n))throw TypeError("Stringified UUID is invalid");return n};var u,f,h=0,g=0;const m=function(e,t,n){var r=t&&n||0,o=t||new Array(16),a=(e=e||{}).node||u,i=void 0!==e.clockseq?e.clockseq:f;if(null==a||null==i){var c=e.random||(e.rng||s)();null==a&&(a=u=[1|c[0],c[1],c[2],c[3],c[4],c[5]]),null==i&&(i=f=16383&(c[6]<<8|c[7]))}var l=void 0!==e.msecs?e.msecs:Date.now(),m=void 0!==e.nsecs?e.nsecs:g+1,p=l-h+(m-g)/1e4;if(p<0&&void 0===e.clockseq&&(i=i+1&16383),(p<0||l>h)&&void 0===e.nsecs&&(m=0),m>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");h=l,g=m,f=i;var k=(1e4*(268435455&(l+=122192928e5))+m)%4294967296;o[r++]=k>>>24&255,o[r++]=k>>>16&255,o[r++]=k>>>8&255,o[r++]=255&k;var w=l/4294967296*1e4&268435455;o[r++]=w>>>8&255,o[r++]=255&w,o[r++]=w>>>24&15|16,o[r++]=w>>>16&255,o[r++]=i>>>8|128,o[r++]=255&i;for(var v=0;v<6;++v)o[r+v]=a[v];return t||d(o)},p=function(e){if(!i(e))throw TypeError("Invalid UUID");var t,n=new Uint8Array(16);return n[0]=(t=parseInt(e.slice(0,8),16))>>>24,n[1]=t>>>16&255,n[2]=t>>>8&255,n[3]=255&t,n[4]=(t=parseInt(e.slice(9,13),16))>>>8,n[5]=255&t,n[6]=(t=parseInt(e.slice(14,18),16))>>>8,n[7]=255&t,n[8]=(t=parseInt(e.slice(19,23),16))>>>8,n[9]=255&t,n[10]=(t=parseInt(e.slice(24,36),16))/1099511627776&255,n[11]=t/4294967296&255,n[12]=t>>>24&255,n[13]=t>>>16&255,n[14]=t>>>8&255,n[15]=255&t,n};function k(e,t,n){function r(e,r,o,s){if("string"==typeof e&&(e=function(e){e=unescape(encodeURIComponent(e));for(var t=[],n=0;n<e.length;++n)t.push(e.charCodeAt(n));return t}(e)),"string"==typeof r&&(r=p(r)),16!==r.length)throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");var a=new Uint8Array(16+e.length);if(a.set(r),a.set(e,r.length),(a=n(a))[6]=15&a[6]|t,a[8]=63&a[8]|128,o){s=s||0;for(var i=0;i<16;++i)o[s+i]=a[i];return o}return d(a)}try{r.name=e}catch(e){}return r.DNS="6ba7b810-9dad-11d1-80b4-00c04fd430c8",r.URL="6ba7b811-9dad-11d1-80b4-00c04fd430c8",r}function w(e){return 14+(e+64>>>9<<4)+1}function v(e,t){var n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}function _(e,t,n,r,o,s){return v((a=v(v(t,e),v(r,s)))<<(i=o)|a>>>32-i,n);var a,i}function y(e,t,n,r,o,s,a){return _(t&n|~t&r,e,t,o,s,a)}function b(e,t,n,r,o,s,a){return _(t&r|n&~r,e,t,o,s,a)}function D(e,t,n,r,o,s,a){return _(t^n^r,e,t,o,s,a)}function P(e,t,n,r,o,s,a){return _(n^(t|~r),e,t,o,s,a)}const E=k("v3",48,(function(e){if("string"==typeof e){var t=unescape(encodeURIComponent(e));e=new Uint8Array(t.length);for(var n=0;n<t.length;++n)e[n]=t.charCodeAt(n)}return function(e){for(var t=[],n=32*e.length,r="0123456789abcdef",o=0;o<n;o+=8){var s=e[o>>5]>>>o%32&255,a=parseInt(r.charAt(s>>>4&15)+r.charAt(15&s),16);t.push(a)}return t}(function(e,t){e[t>>5]|=128<<t%32,e[w(t)-1]=t;for(var n=1732584193,r=-271733879,o=-1732584194,s=271733878,a=0;a<e.length;a+=16){var i=n,c=r,l=o,d=s;n=y(n,r,o,s,e[a],7,-680876936),s=y(s,n,r,o,e[a+1],12,-389564586),o=y(o,s,n,r,e[a+2],17,606105819),r=y(r,o,s,n,e[a+3],22,-1044525330),n=y(n,r,o,s,e[a+4],7,-176418897),s=y(s,n,r,o,e[a+5],12,1200080426),o=y(o,s,n,r,e[a+6],17,-1473231341),r=y(r,o,s,n,e[a+7],22,-45705983),n=y(n,r,o,s,e[a+8],7,1770035416),s=y(s,n,r,o,e[a+9],12,-1958414417),o=y(o,s,n,r,e[a+10],17,-42063),r=y(r,o,s,n,e[a+11],22,-1990404162),n=y(n,r,o,s,e[a+12],7,1804603682),s=y(s,n,r,o,e[a+13],12,-40341101),o=y(o,s,n,r,e[a+14],17,-1502002290),n=b(n,r=y(r,o,s,n,e[a+15],22,1236535329),o,s,e[a+1],5,-165796510),s=b(s,n,r,o,e[a+6],9,-1069501632),o=b(o,s,n,r,e[a+11],14,643717713),r=b(r,o,s,n,e[a],20,-373897302),n=b(n,r,o,s,e[a+5],5,-701558691),s=b(s,n,r,o,e[a+10],9,38016083),o=b(o,s,n,r,e[a+15],14,-660478335),r=b(r,o,s,n,e[a+4],20,-405537848),n=b(n,r,o,s,e[a+9],5,568446438),s=b(s,n,r,o,e[a+14],9,-1019803690),o=b(o,s,n,r,e[a+3],14,-187363961),r=b(r,o,s,n,e[a+8],20,1163531501),n=b(n,r,o,s,e[a+13],5,-1444681467),s=b(s,n,r,o,e[a+2],9,-51403784),o=b(o,s,n,r,e[a+7],14,1735328473),n=D(n,r=b(r,o,s,n,e[a+12],20,-1926607734),o,s,e[a+5],4,-378558),s=D(s,n,r,o,e[a+8],11,-2022574463),o=D(o,s,n,r,e[a+11],16,1839030562),r=D(r,o,s,n,e[a+14],23,-35309556),n=D(n,r,o,s,e[a+1],4,-1530992060),s=D(s,n,r,o,e[a+4],11,1272893353),o=D(o,s,n,r,e[a+7],16,-155497632),r=D(r,o,s,n,e[a+10],23,-1094730640),n=D(n,r,o,s,e[a+13],4,681279174),s=D(s,n,r,o,e[a],11,-358537222),o=D(o,s,n,r,e[a+3],16,-722521979),r=D(r,o,s,n,e[a+6],23,76029189),n=D(n,r,o,s,e[a+9],4,-640364487),s=D(s,n,r,o,e[a+12],11,-421815835),o=D(o,s,n,r,e[a+15],16,530742520),n=P(n,r=D(r,o,s,n,e[a+2],23,-995338651),o,s,e[a],6,-198630844),s=P(s,n,r,o,e[a+7],10,1126891415),o=P(o,s,n,r,e[a+14],15,-1416354905),r=P(r,o,s,n,e[a+5],21,-57434055),n=P(n,r,o,s,e[a+12],6,1700485571),s=P(s,n,r,o,e[a+3],10,-1894986606),o=P(o,s,n,r,e[a+10],15,-1051523),r=P(r,o,s,n,e[a+1],21,-2054922799),n=P(n,r,o,s,e[a+8],6,1873313359),s=P(s,n,r,o,e[a+15],10,-30611744),o=P(o,s,n,r,e[a+6],15,-1560198380),r=P(r,o,s,n,e[a+13],21,1309151649),n=P(n,r,o,s,e[a+4],6,-145523070),s=P(s,n,r,o,e[a+11],10,-1120210379),o=P(o,s,n,r,e[a+2],15,718787259),r=P(r,o,s,n,e[a+9],21,-343485551),n=v(n,i),r=v(r,c),o=v(o,l),s=v(s,d)}return[n,r,o,s]}(function(e){if(0===e.length)return[];for(var t=8*e.length,n=new Uint32Array(w(t)),r=0;r<t;r+=8)n[r>>5]|=(255&e[r/8])<<r%32;return n}(e),8*e.length))})),C=function(e,t,n){var r=(e=e||{}).random||(e.rng||s)();if(r[6]=15&r[6]|64,r[8]=63&r[8]|128,t){n=n||0;for(var o=0;o<16;++o)t[n+o]=r[o];return t}return d(r)};function U(e,t,n,r){switch(e){case 0:return t&n^~t&r;case 1:case 3:return t^n^r;case 2:return t&n^t&r^n&r}}function L(e,t){return e<<t|e>>>32-t}const I=k("v5",80,(function(e){var t=[1518500249,1859775393,2400959708,3395469782],n=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof e){var r=unescape(encodeURIComponent(e));e=[];for(var o=0;o<r.length;++o)e.push(r.charCodeAt(o))}else Array.isArray(e)||(e=Array.prototype.slice.call(e));e.push(128);for(var s=e.length/4+2,a=Math.ceil(s/16),i=new Array(a),c=0;c<a;++c){for(var l=new Uint32Array(16),d=0;d<16;++d)l[d]=e[64*c+4*d]<<24|e[64*c+4*d+1]<<16|e[64*c+4*d+2]<<8|e[64*c+4*d+3];i[c]=l}i[a-1][14]=8*(e.length-1)/Math.pow(2,32),i[a-1][14]=Math.floor(i[a-1][14]),i[a-1][15]=8*(e.length-1)&4294967295;for(var u=0;u<a;++u){for(var f=new Uint32Array(80),h=0;h<16;++h)f[h]=i[u][h];for(var g=16;g<80;++g)f[g]=L(f[g-3]^f[g-8]^f[g-14]^f[g-16],1);for(var m=n[0],p=n[1],k=n[2],w=n[3],v=n[4],_=0;_<80;++_){var y=Math.floor(_/20),b=L(m,5)+U(y,p,k,w)+v+t[y]+f[_]>>>0;v=w,w=k,k=L(p,30)>>>0,p=m,m=b}n[0]=n[0]+m>>>0,n[1]=n[1]+p>>>0,n[2]=n[2]+k>>>0,n[3]=n[3]+w>>>0,n[4]=n[4]+v>>>0}return[n[0]>>24&255,n[0]>>16&255,n[0]>>8&255,255&n[0],n[1]>>24&255,n[1]>>16&255,n[1]>>8&255,255&n[1],n[2]>>24&255,n[2]>>16&255,n[2]>>8&255,255&n[2],n[3]>>24&255,n[3]>>16&255,n[3]>>8&255,255&n[3],n[4]>>24&255,n[4]>>16&255,n[4]>>8&255,255&n[4]]})),S="00000000-0000-0000-0000-000000000000",T=function(e){if(!i(e))throw TypeError("Invalid UUID");return parseInt(e.substr(14,1),16)}}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var s=t[r]={exports:{}};return e[r](s,s.exports,n),s.exports}n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{let e=n(614);var t,r,o,s,a=document.querySelector(".alerts"),i=(document.querySelector(".game"),document.querySelector(".game__stock-cloth"),document.querySelector(".deck")),c=document.querySelector(".game__stock-cloth__revealed-cards"),l=document.querySelector(".game__working-cloth__piles"),d=document.querySelector(".game__controls__new-game"),u=document.querySelector(".game__controls__undo"),f=document.querySelector(".game__foundation-cloth"),h=document.querySelector(".game__foundation-cloth__spades"),g=document.querySelector(".game__foundation-cloth__clubs"),m=document.querySelector(".game__foundation-cloth__hearts"),p=document.querySelector(".game__foundation-cloth__diamonds"),k=new Audio("./media/nirmatara_click-sound-effect.wav");!function(e){e.black="black",e.red="red"}(t||(t={})),function(e){e.spades="spades",e.clubs="clubs",e.hearts="hearts",e.diamonds="diamonds"}(r||(r={})),function(e){e.ace="A",e.two="2",e.three="3",e.four="4",e.five="5",e.six="6",e.seven="7",e.eight="8",e.nine="9",e.ten="10",e.jack="J",e.queen="Q",e.king="K"}(o||(o={})),function(e){e[e.stockRevealedCards=0]="stockRevealedCards",e[e.workingPile0=1]="workingPile0",e[e.workingPile1=2]="workingPile1",e[e.workingPile2=3]="workingPile2",e[e.workingPile3=4]="workingPile3",e[e.workingPile4=5]="workingPile4",e[e.workingPile5=6]="workingPile5",e[e.workingPile6=7]="workingPile6",e[e.foundationDeckSpades=8]="foundationDeckSpades",e[e.foundationDeckClubs=9]="foundationDeckClubs",e[e.foundationDeckHearts=10]="foundationDeckHearts",e[e.foundationDeckDiamonds=11]="foundationDeckDiamonds",e[e.stockDeck=12]="stockDeck"}(s||(s={}));class w{constructor(t,n,r){this.draggable=!0,this.dropTarget=!1,this.forceFaceUp=!1,this.suit=t,this.value=n,this.id=r||e.v4()}get html(){return`<div class="card ${this.color}${this.dropTarget?" drop-target":""}" id="${this.id}" draggable="${this.draggable}">\n      <div class="card__top-left">\n        <div class="card__corner-value">${this.value}</div>\n        <img src="./media/${this.suit}.svg" class="card__corner-suit" draggable="false">\n      </div>\n      <div class="card__bottom-right">\n        <div class="card__corner-value">${this.value}</div>\n        <img src="./media/${this.suit}.svg" class="card__corner-suit" draggable="false">\n      </div>\n    </div>`}get color(){switch(this.suit){case r.spades:case r.clubs:return t.black;case r.diamonds:case r.hearts:return t.red}}clone(){let e=new w(this.suit,this.value,this.id);return e.draggable=this.draggable,e.forceFaceUp=this.forceFaceUp,e.dropTarget=this.dropTarget,e}}w.faceDownHTML='<div class="card--face-down"></div>',w.prototype.valueOf=function(){if(Number(this.value))return Number(this.value);if("A"==this.value)return 1;if("J"==this.value)return 11;if("Q"==this.value)return 12;if("K"==this.value)return 13;throw new Error("Unable to determine primitive value of card.")};class v{constructor(e){this.cards=e}shuffled(){for(var e=this.cards.length-1;e>0;e--){const t=Math.floor(Math.random()*(e+1));[this.cards[e],this.cards[t]]=[this.cards[t],this.cards[e]]}return this}static newDeck(){let e=[];for(const t of Object.values(r))for(const n of Object.values(o))e.push(new w(t,n));return new v(e)}}class _{constructor(e){this.dropTarget=!0,this.suit=e}get html(){return`<div class="card--suit-placeholder${this.dropTarget?" drop-target":""}"><img src="./media/${this.suit}.svg" draggable="false"></div>`}}function y(e){switch(e){case"spades":return h;case"clubs":return g;case"hearts":return m;case"diamonds":return p}}_.spades=new _(r.spades),_.clubs=new _(r.clubs),_.hearts=new _(r.hearts),_.diamonds=new _(r.diamonds);class b{constructor(t,n,r){this.state=new P;let o=[];for(const e of t.allCards)o.push(e.clone());this.state.allCards=o;let s=[];for(const e of t.stockDeck.cards)s.push(e.clone());this.state.stockDeck=new v(s);let a=[];for(const e of t.stockRevealedCards)a.push(e.clone());this.state.stockRevealedCards=a;let i=[[],[],[],[],[],[],[]];for(let e=0;e<i.length;e++)for(const n of t.workingPiles[e])i[e].push(n.clone());this.state.workingPiles=i;let c={spades:[],clubs:[],hearts:[],diamonds:[]};for(const e in c)for(const n of t.foundationDecks[e])c[e].push(n.clone());this.state.foundationDecks=c,this.state.history=t.history,this.state.gameEnded=t.gameEnded,this.id=n||e.v4(),this.timeDiscarded=r||new Date}}class D{constructor(t,n,r,o){this.fadeOut=!0,this.text=t,this.id=n||e.v4(),this.buttonId=r||e.v4(),o&&(this.fadeOut=o)}get html(){return`<div class="alert" id="${this.id}">\n      <span>${this.text}</span>\n      <button id="${this.buttonId}"><strong>X</strong></button>\n    </div>`}}class P{constructor(){this.history=[],this.gameEnded=!1,this.alerts=[],this.resetState()}loadState(e){for(const t in e)this[t]=e[t]}static deepCopy(e){return Array.isArray(e)?e.map((e=>this.deepCopy(e))):e instanceof Date?new Date(e.getTime()):e&&"object"==typeof e?Object.getOwnPropertyNames(e).reduce(((t,n)=>(Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n)),t[n]=this.deepCopy(e[n]),t)),Object.create(Object.getPrototypeOf(e))):e}resetState(){this.gameEnded=!1,this.stockDeck=v.newDeck().shuffled(),this.allCards=[];for(const e of this.stockDeck.cards){const t=e;this.allCards.push(t)}this.stockRevealedCards=[];let e=[];for(let n=1;n<8;n++){var t=[];for(let e=0;e<n;e++){let e=this.stockDeck.cards.pop();t.push(e)}e.push(t)}this.workingPiles=e,this.foundationDecks={spades:new Array,clubs:new Array,hearts:new Array,diamonds:new Array},this.alerts=[]}forceUpdateUI(){const t=()=>{a.innerHTML="";for(const e of this.alerts)a.innerHTML+=e.html,e.fadeOut&&document.getElementById(e.buttonId).addEventListener("click",(()=>{C(e.id)}))};c.replaceChildren(),this.stockRevealedCards.forEach(((e,t)=>{if(0===t)c.innerHTML+=e.html+"\n";else{const t=e.clone();t.draggable=!1,c.innerHTML+=t.html+"\n",document.getElementById(t.id).style.opacity="0.5"}}));for(let t=0;t<7;t++){const n=l.children[t];n.innerHTML="";const r=this.workingPiles[t];if(0!==r.length)for(let t=0,o=!1,s="";t<r.length;t++){const a=r[t];let i=a.clone();!0===o?a===r[r.length-1]?document.getElementById(s).innerHTML+=a.html:(i.draggable=!1,document.getElementById(s).innerHTML+=i.html):!0===a.forceFaceUp&&t!==r.length-1?(o=!0,s=e.v4(),i.draggable=!1,n.innerHTML+=`<div class="game__working-cloth__face-up-pile" id="${s}" draggable="true">\n            ${i.html}\n          </div>`):t===r.length-1?n.innerHTML+=a.html:n.innerHTML+=w.faceDownHTML}}!function(){const e=document.getElementsByClassName("pile"),t=document.getElementsByClassName("game__working-cloth__face-up-pile");for(let t=0;t<e.length;t++){let n=e.item(t);for(let e=0;e<n.children.length;e++)if(0!==e&&n.children[e-1].classList.contains("game__working-cloth__face-up")){const t=4.5*e+6.9*n.children[e-1].children.length+10;n.children[e].setAttribute("style",`transform: translateY(-${t}rem);`)}else n.children[e].setAttribute("style",`transform: translateY(-${4.5*e}rem);`);E.workingPiles[t].length>9&&(n.style.overflowY="scroll")}for(let e=0;e<t.length;e++){let n=t.item(e);for(let e=0;e<n.children.length;e++)n.children[e].setAttribute("style",`transform: translateY(-${4.5*e}rem);`)}}(),function(){let e=!0;for(let t=0;t<f.children.length;t++)f.children[t].replaceChildren(),0!=f.children[t].children.length&&(e=!1)}();for(const e in this.foundationDecks)if(0!=this.foundationDecks[e].length){let t=this.foundationDecks[e][this.foundationDecks[e].length-1];y(e).innerHTML=t.html}else y(e).innerHTML=_[e].html;const n=document.getElementsByClassName("card"),r=document.getElementsByClassName("game__working-cloth__face-up-pile"),o=e=>{e.dataTransfer.setData("id",e.target.id),e.dataTransfer.setData("element",e.target.toString())};for(let e=0;e<n.length;e++)n.item(e).addEventListener("dragstart",o);for(let e=0;e<r.length;e++)r.item(e).addEventListener("dragstart",o);const s=document.getElementsByClassName("drop-target");for(let e=0;e<s.length;e++)s.item(e).addEventListener("dragover",(e=>{e.preventDefault()}));for(let e=0;e<s.length;e++){const t=s.item(e);t.addEventListener("drop",(e=>{const n=e.dataTransfer.getData("id");let r,o=document.getElementById(n);if(null===o)throw new Error(`dragElement was null: dataTransfer.getData.('element') is ${e.dataTransfer.getData("element")}`);if(o.classList.contains("game__working-cloth__face-up-pile")){let e=[];for(let t=0;t<o.children.length;t++)e.push(U(o.children[t].id));r={id:n,cards:e}}else r=U(n);S(r,L(t))&&(e.preventDefault(),I(r,L(t)),k.play(),this.forceUpdateUI())}))}const i=e=>{const t=document.getElementsByClassName("card"),n=document.getElementsByClassName("deck"),r=(e,n)=>{t.item(e).style.pointerEvents=n};if(!0===e){for(let e=0;e<t.length;e++)r(e,"none");for(let e=0;e<n.length;e++)r(e,"none")}else{for(let e=0;e<t.length;e++)r(e,"auto");for(let e=0;e<n.length;e++)r(e,"auto")}};if(this.gameEnded){i(!0);const e="Congratulations! You won the game.";0===this.alerts.filter((t=>t.text===e)).length&&(this.alerts.push(new D(e)),t())}else i(!1);0===this.history.length?(u.disabled=!0,u.classList.add("disabled")):(u.disabled=!1,u.classList.remove("disabled"))}}let E=new P;function C(e){document.getElementById(e).style.animationName="fadeOut",window.setTimeout((()=>{document.getElementById(e).remove()}),1e3)}function U(e){for(const t of E.stockDeck.cards)if(t.id===e)return t;for(const t of E.stockRevealedCards)if(t.id===e)return t;for(const t of E.workingPiles)for(const n of t)if(n.id===e)return n;for(const t in E.foundationDecks)for(const n of E.foundationDecks[t])if(n.id===e)return n;throw new Error("Unable to find card specified by ID: "+e)}function L(e){const t=e.parentElement;if(t.classList.contains("game__working-cloth__face-up-pile")){if(Number(t.parentElement.dataset.index))return Number(t.parentElement.dataset.index)+1;switch(t.parentElement.dataset.index){case"0":return s.workingPile0;case"1":return s.workingPile1;case"2":return s.workingPile2;case"3":return s.workingPile3;case"4":return s.workingPile4;case"5":return s.workingPile5;case"6":return s.workingPile6;default:throw new Error("Unable to match game element's pile data index value to a working pile position: "+t)}}else if(e.classList.contains("game__working-cloth__face-up-pile")){if(Number(e.parentElement.dataset.index))return Number(e.parentElement.dataset.index)+1;switch(e.parentElement.dataset.index){case"0":return s.workingPile0;case"1":return s.workingPile1;case"2":return s.workingPile2;case"3":return s.workingPile3;case"4":return s.workingPile4;case"5":return s.workingPile5;case"6":return s.workingPile6}throw new Error("Unable to match the element provided to a pile. "+e)}if(e.classList.contains("game__stock-cloth__revealed-cards")||t.classList.contains("game__stock-cloth__revealed-cards"))return s.stockRevealedCards;if(t.classList.contains("pile")){if(Number(t.dataset.index))return Number(t.dataset.index)+1;switch(t.dataset.index){case"0":return s.workingPile0;case"1":return s.workingPile1;case"2":return s.workingPile2;case"3":return s.workingPile3;case"4":return s.workingPile4;case"5":return s.workingPile5;case"6":return s.workingPile6}throw new Error("Unable to match the element provided to a pile. "+e)}if(e.classList.contains("pile")){if(Number(e.dataset.index))return Number(e.dataset.index)+1;switch(e.dataset.index){case"0":return s.workingPile0;case"1":return s.workingPile1;case"2":return s.workingPile2;case"3":return s.workingPile3;case"4":return s.workingPile4;case"5":return s.workingPile5;case"6":return s.workingPile6}throw new Error("Unable to match the element provided to a pile. "+e)}for(let e=0;e<t.classList.length;e++)if(t.classList.item(e).includes("foundation-cloth"))switch(t.classList.item(e)){case"game__foundation-cloth__spades":return s.foundationDeckSpades;case"game__foundation-cloth__clubs":return s.foundationDeckClubs;case"game__foundation-cloth__hearts":return s.foundationDeckHearts;case"game__foundation-cloth__diamonds":return s.foundationDeckDiamonds;default:throw new Error("Unable to find matching foundation cloth position for game element: "+t)}for(let t=0;t<e.classList.length;t++)if(e.classList.item(t).includes("foundation-cloth"))switch(e.classList.item(t)){case"game__foundation-cloth__spades":return s.foundationDeckSpades;case"game__foundation-cloth__clubs":return s.foundationDeckClubs;case"game__foundation-cloth__hearts":return s.foundationDeckHearts;case"game__foundation-cloth__diamonds":return s.foundationDeckDiamonds;default:throw new Error("Unable to find matching foundation cloth position for game element: "+e)}throw console.log(e),new Error("Unable to find position of element specified: "+e)}function I(e,t){if(E.history.push(new b(E)),e instanceof w){const n=e,r=document.getElementById(n.id),o=L(r);if(t>0&&t<8)n.dropTarget=!1,E.workingPiles[t-1][E.workingPiles[t-1].length-1].forceFaceUp=!0,E.workingPiles[t-1].push(n);else if(t>7&&t<12)switch(n.dropTarget=!0,t){case s.foundationDeckClubs:E.foundationDecks.clubs.push(n);break;case s.foundationDeckDiamonds:E.foundationDecks.diamonds.push(n);break;case s.foundationDeckHearts:E.foundationDecks.hearts.push(n);break;case s.foundationDeckSpades:E.foundationDecks.spades.push(n)}if(0===o)for(let e=0;e<3;e++)c.children.item(e)===r&&E.stockRevealedCards.splice(e,1);else if(o>0&&o<8)E.workingPiles[o-1].pop();else if(o>7&&o<12)switch(o){case s.foundationDeckClubs:E.foundationDecks.clubs.pop();break;case s.foundationDeckDiamonds:E.foundationDecks.diamonds.pop();break;case s.foundationDeckHearts:E.foundationDecks.hearts.pop();break;case s.foundationDeckSpades:E.foundationDecks.spades.pop()}}else{const n=e,r=E.workingPiles[t-1],o=L(document.getElementById(n.id));r[r.length-1].forceFaceUp=!0;for(const e of n.cards)r.push(e);const s=E.workingPiles[o-1];s.splice(s.length-n.cards.length,n.cards.length)}(function(){let e=0;for(const t in E.foundationDecks)13===E.foundationDecks[t].length&&e++;return 4===e})()&&(E.gameEnded=!0)}function S(e,t){if(12===t)return!1;if(e instanceof w){const n=e;if(L(document.getElementById(n.id))==t)return!1;if(t>7){const e=function(e,t){if(n.suit!==e)return!1;const r=t.children.item(0);return!(!r.classList.contains("card--suit-placeholder")||n.value!=o.ace)||(!r.classList.contains("card--suit-placeholder")||n.value==o.ace)&&(n>U(r.id)||void 0)};switch(t){case s.foundationDeckClubs:return e(r.clubs,g);case s.foundationDeckDiamonds:return e(r.diamonds,p);case s.foundationDeckHearts:return e(r.hearts,m);case s.foundationDeckSpades:return e(r.spades,h)}}if(t>0&&t<8){const e=E.workingPiles[t-1];if(0==e.length)return!1;const r=e[e.length-1];if(n.color!==r.color&&n.valueOf()===r.valueOf()-1)return!0}}else{if(!(t>0&&t<8))return!1;{const n=E.workingPiles[t-1];if(0==n.length)return!1;const r=e.cards[0],o=n[n.length-1];if(r.color!==o.color&&r.valueOf()===o.valueOf()-1)return!0}}return!1}E.forceUpdateUI(),i.addEventListener("click",(e=>{E.history.push(new b(E));const t=E.stockRevealedCards,n=E.stockDeck.cards;t.length<3||n.unshift(t.pop()),t.unshift(n.pop()),E.forceUpdateUI()})),d.addEventListener("click",(()=>{E.history=[],E.resetState(),E.forceUpdateUI()})),u.addEventListener("click",(()=>{E.loadState(E.history[E.history.length-1].state),E.history.splice(E.history.length-1,1),E.forceUpdateUI()}))})()})();