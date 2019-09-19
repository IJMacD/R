(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{15:function(e,r,t){e.exports=t(25)},21:function(e,r,t){},22:function(e,r,t){},23:function(e,r,t){},24:function(e,r,t){},25:function(e,r,t){"use strict";t.r(r);var n=t(0),a=t.n(n),o=t(12),u=t.n(o),c=(t(21),t(13)),i=t(1),l=(t(22),t(23),0);function s(e){var r=e.history,t=e.sendCommand,n=e.performReplacement,o=a.a.useState(""),u=Object(i.a)(o,2),c=u[0],s=u[1],f=a.a.useRef(),p=a.a.useRef();function m(){t(c),s(""),setTimeout(function(){return"undefined"!==typeof f.current&&(f.current.scrollTop=f.current.scrollHeight)},10),l=0}function v(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=r.filter(function(e){return"input"===e.type});0!==t.length&&(e&&l>1?l--:!e&&l<t.length&&l++,s(t[t.length-l].content))}return a.a.createElement("div",{className:"Console",onClick:function(){return p.current&&document.getSelection().isCollapsed&&p.current.focus()}},a.a.createElement("div",{className:"Console-historyscroller",ref:f},a.a.createElement("ul",{className:"Console-history"},r.map(function(e){return"input"===e.type?a.a.createElement("li",{key:e.id,className:"line line-input"},e.content):a.a.createElement("li",{key:e.id,className:"line line-".concat(e.type)},e.content)}))),a.a.createElement("div",{className:"Console-inputline"},a.a.createElement("span",{className:"Console-prompt"},">"),a.a.createElement("input",{value:c,className:"Console-input",autoFocus:!0,ref:p,onChange:function(e){var r=e.target.value;n&&(r=r.replace("*","\xd7").replace("/","\xf7").replace("!=","\u2260").replace("!=","\u2260").replace("<=","\u2a7d").replace(">=","\u2a7e").replace("->","\u2192").replace("<-","\u2190")),s(r)},onKeyDown:function(e){"Enter"===e.key?m():"ArrowUp"===e.key?(v(),e.preventDefault()):"ArrowDown"===e.key&&(v(!0),e.preventDefault())}}),a.a.createElement("button",{onClick:m},"Send")))}var f=t(7),p=t(2),m=t(6);t(24);function v(e){var r=function(e,r){if("object"!==typeof e||null===e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,r||"default");if("object"!==typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(e)}(e,"string");return"symbol"===typeof r?r:String(r)}function h(e){var r=e.variables,t=e.setVariables,n=a.a.useState(""),o=Object(i.a)(n,2),u=o[0],c=o[1],l=a.a.useState(""),s=Object(i.a)(l,2),h=s[0],y=s[1],d=a.a.useRef();return a.a.createElement("form",{onSubmit:function(e){var n;try{n=JSON.parse(h)}catch(e){n=h}t(Object(m.a)({},r,Object(p.a)({},u,n))),c(""),y(""),"undefined"!==typeof d&&"undefined"!==typeof d.current&&d.current.focus(),e.preventDefault()}},a.a.createElement("table",{className:"Variables"},a.a.createElement("thead",null,a.a.createElement("tr",null,a.a.createElement("th",null,"Name"),a.a.createElement("th",null,"Value"))),a.a.createElement("tbody",null,Object.keys(r).map(function(e){return a.a.createElement("tr",{key:e},a.a.createElement("td",null,e),a.a.createElement("td",null,JSON.stringify(r[e])),a.a.createElement("td",null,a.a.createElement("button",{type:"button",onClick:function(){return t(function(e,r){e[r];return Object(f.a)(e,[r].map(v))}(r,e))}},"x")))}),a.a.createElement("tr",null,a.a.createElement("td",null,a.a.createElement("input",{ref:d,value:u,onChange:function(e){return c(e.target.value)},placeholder:"Name"})),a.a.createElement("td",null,a.a.createElement("input",{value:h,onChange:function(e){return y(e.target.value)},placeholder:"Value"})),a.a.createElement("td",null,a.a.createElement("button",{type:"submit"},"+"))))))}function y(e){return a.a.createElement("div",null)}function d(e,r){if("number"===typeof r||"string"===typeof r)return r;var t="name"===r.type?e[r.value]:r.value;if("undefined"===typeof t)throw Error("symbol not found: "+r.value);return t}function g(e,r){if("number"===typeof r)return!0;if(Array.isArray(r)||"object"!==typeof r)return!1;if("number"!==r.type&&"name"!==r.type)return!1;var t="name"===r.type?e[r.value]:r.value;return"undefined"!==typeof t&&"number"===typeof t}function b(e,r){if(Array.isArray(r))return!0;if("object"!==typeof r)return!1;if("name"!==r.type)return!1;var t=e[r.value];return"undefined"!==typeof t&&!!Array.isArray(t)}function w(e,r){if("number"===typeof r)return r;if(Array.isArray(r))throw Error("Invalid numeric value: [Array(".concat(r.length,")]"));if("object"!==typeof r)throw Error("Invalid numeric value: [".concat(r,"]"));if("number"!==r.type&&"name"!==r.type)throw Error("Invalid numeric value: [".concat(r.value,"]"));var t="name"===r.type?e[r.value]:r.value;if("undefined"===typeof t)throw Error("Symbol not found: "+r.value);if("number"!==typeof t)throw Error("Variable '".concat(r.value,"' does not contain a numeric value"));return t}function E(e,r){if(Array.isArray(r))return r;if("name"!==r.type)throw Error("Invalid vector value: [".concat(r.value,"]"));var t=e[r.value];if("undefined"===typeof t)throw Error("Symbol not found: "+r.value);if(!Array.isArray(t))throw Error("Variable '".concat(r.value,"' does not contain a vector value"));return t}function k(e,r,t,n){if(g(e,r)&&g(e,n))return function(e,r,t,n){var a=w(e,r),o=w(e,n);switch(t){case"+":return a+o;case"-":return a-o;case"*":case"\xd7":return a*o;case"/":case"\xf7":return a/o;case"^":return Math.pow(a,o);case"==":return a==o;case"!=":case"\u2260":return a!=o;case"<":return a<o;case">":return a>o;case"<=":case"\u2264":case"\u2a7d":return a<=o;case">=":case"\u2265":case"\u2a7e":return a>=o;case"&&":return Boolean(a&&o);case"||":return Boolean(a||o);case"&":throw Error("Use && to compare numbers");case"|":throw Error("Use || to compare numbers")}throw Error("Unrecognised operator: "+t)}(e,r,t,n);if(b(e,r)&&b(e,n))return function(e,r,t,n){var a=E(e,r),o=E(e,n);if(a.length!=o.length)throw Error("Vector lengths do not match: ".concat(a.length," and ").concat(o.length));switch(t){case"+":return a.map(function(e,r){return e+o[r]});case"-":return a.map(function(e,r){return e-o[r]});case"*":case"\xd7":return a.map(function(e,r){return e*o[r]});case"/":case"\xf7":return a.map(function(e,r){return e/o[r]});case"^":return a.map(function(e,r){return Math.pow(e,o[r])});case"==":return a.map(function(e,r){return e==o[r]});case"!=":case"\u2260":return a.map(function(e,r){return e!=o[r]});case"<":return a.map(function(e,r){return e<o[r]});case">":return a.map(function(e,r){return e>o[r]});case"<=":case"\u2264":case"\u2a7d":return a.map(function(e,r){return e<=o[r]});case">=":case"\u2265":case"\u2a7e":return a.map(function(e,r){return e>=o[r]});case"&":return a.map(function(e,r){return Boolean(e&&o[r])});case"|":return a.map(function(e,r){return Boolean(e||o[r])});case"&&":return a.every(function(e,r){return e&&o[r]});case"||":return a.every(function(e,r){return e||o[r]})}throw Error("Unrecognised operator: "+t)}(e,r,t,n);if(b(e,r)&&g(e,n))return S(e,r,t,n);if(g(e,r)&&b(e,n))return function(e,r,t,n){var a=w(e,r),o=E(e,n);switch(t){case"-":return o.map(function(e){return a-e});case"/":return o.map(function(e){return a/e});case"^":return o.map(function(e){return Math.pow(a,e)});default:return S(e,o,function(e){if(">"===e)return"<";if("<"===e)return">";if(">="===e)return"<=";if("<="===e)return">=";if("-"===e||"/"===e||"^"===e)throw Error("Operator ".concat(e," is not commutative"));return e}(t),a)}}(e,r,t,n);throw Error("Invalid expression")}function S(e,r,t,n){var a=E(e,r),o=w(e,n);switch(t){case"+":return a.map(function(e){return e+o});case"-":return a.map(function(e){return e-o});case"*":case"\xd7":return a.map(function(e){return e*o});case"/":case"\xf7":return a.map(function(e){return e/o});case"^":return a.map(function(e){return Math.pow(e,o)});case"==":return a.map(function(e){return e==o});case"!=":case"\u2260":return a.map(function(e){return e!=o});case"<":return a.map(function(e){return e<o});case">":return a.map(function(e){return e>o});case"<=":case"\u2264":case"\u2a7d":return a.map(function(e){return e<=o});case">=":case"\u2265":case"\u2a7e":return a.map(function(e){return e>=o});case"&":return a.map(function(e){return Boolean(e&&o)});case"|":return a.map(function(e){return Boolean(e||o)});case"&&":return a.every(function(e){return e&&o});case"||":return a.every(function(e){return e||o})}throw Error("Unrecognised operator: "+t)}var A={string:{match:/^"([^"]*)"/,map:function(e){return e[1]}},number:{match:/^-?[0-9]+(?:\.[0-9]+)?/,map:function(e){return+e[0]}},name:{match:/^[a-z][a-z0-9_.]*/i},operator:{match:/^(<-|->|==|!=|<=|>=|&&|\|\||[-+*\/<>&|^\xd7\xf7\u2190\u2192\u2260\u2264\u2265\u2a7d\u2a7e])/},bracket:{match:/^[()]/},index_bracket:{match:/^[[\]]/},range:{match:/^:/},whitespace:{match:/^\s+/,ignore:!0}};var j=t(8),O=t(9),N=t(5),C=t(4),x=t(10),R=t(14),V=function(e){function r(e,t){var n;return Object(j.a)(this,r),(n=Object(N.a)(this,Object(C.a)(r).call(this,e*t))).cols=void 0,n.rows=void 0,n.cols=e,n.rows=t,n.fill(0),n}return Object(x.a)(r,e),Object(O.a)(r,[{key:"getValue",value:function(e,r){return this[e*this.rows+r]}},{key:"setValue",value:function(e,r,t){this[e*this.rows+r]=t}},{key:"add",value:function(e){if(e.length!==this.length)throw RangeError("Lengths must be the same ".concat(this.length," vs. ").concat(e.length));for(var r=0;r<this.length;r++)this[r]+=e[r]}},{key:"toString",value:function(){for(var e="",r=0;r<this.rows;r++){for(var t=0;t<this.cols;t++){e+=this[t*this.rows+r]+" "}e+="\n"}return e}}]),r}(Object(R.a)(Float64Array));function I(e){var r=function(e,r){if("object"!==typeof e||null===e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,r||"default");if("object"!==typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(e)}(e,"string");return"symbol"===typeof r?r:String(r)}function B(e,r,t){if(0!==e.length){var n=function(e){for(var r=0,t=[];r<e.length;){var n=e.substr(r),a=void 0;for(var o in A){var u=o,c=A[u];if(a=c.match.exec(n)){c.ignore||t.push({type:u,value:c.map?c.map(a):a[0]}),r+=a[0].length;break}}if(!a)throw Error("Unrecognised Input: "+n.substr(0,10))}return t}(e);if(1===n.length){if("name"===n[0].type){if(n[0].value in r)return r[n[0].value];throw Error("symbol not found: "+n[0].value)}if("number"===n[0].type||"string"===n[0].type)return n[0].value;throw Error("Invalid expression")}if(3===n.length){var a=n[0],o=n[1],u=n[2];if(g(r,a)&&"range"===o.type&&g(r,u))return J(w(r,a),w(r,u));if("operator"!==o.type)throw Error("Expression not supported");var c=W(o.value);return _(o,"left")&&"name"===a.type?void U(r,t,a.value,d(r,u)):_(o,"right")&&"name"===u.type?void U(r,t,u.value,d(r,a)):k(r,a,c,u)}if(4===n.length){var i=n[0],l=n[1],s=n[2],p=n[3];if("name"===i.type&&"bracket"===l.type&&"bracket"===p.type)switch(i.value){case"rm":if("name"!==s.type)throw Error("Argument to `rm` must be a name");return void function(e,r,t){e[t];var n=Object(f.a)(e,[t].map(I));r(n)}(r,t,s.value);case"identity":return function(e){for(var r=new V(e,e),t=0;t<e;t++)r.setValue(t,t,1);return r}(w(r,s))}if("name"===i.type&&"index_bracket"===l.type&&"index_bracket"===p.type){var m=E(r,i),v=w(r,s);if(v<1||v>=m.length)throw Error("Index out of range: ".concat(v,"/").concat(m.length));return m[v-1|0]}}if(5===n.length){var h=n[0],y=n[1],S=n[2],j=n[3],O=n[4];if(g(r,h)&&"range"===y.type&&g(r,S)&&"range"===j.type&&g(r,O))return J(w(r,h),w(r,S),w(r,O));if("name"===h.type&&"operator"===y.type&&_(y,"left")&&g(r,S)&&"range"===j.type&&g(r,O)){var N=J(w(r,S),w(r,O));return void U(r,t,h.value,N)}if(g(r,h)&&"range"===y.type&&g(r,S)&&"operator"===j.type&&_(j,"right")&&"name"===O.type){var C=J(w(r,h),w(r,S));return void U(r,t,O.value,C)}if("operator"!==y.type||"operator"!==j.type)throw Error("Expression not supported");var x=W(y.value),R=W(j.value);if(_(y,"left")&&!_(j)&&"name"===h.type){var B=k(r,S,R,O);return void U(r,t,h.value,B)}if(_(j,"right")&&!_(y)&&"name"===O.type){var P=k(r,h,x,S);return void U(r,t,O.value,P)}var T=k(r,h,x,S);if("boolean"===typeof T)throw Error("Bad expression");return k(r,T,R,O)}if(6===n.length){var D=n[0],M=n[1],L=n[2],z=n[3],F=n[4],G=n[5];if("name"===D.type&&b(r,D)&&"index_bracket"===M.type&&g(r,L)&&"range"===z.type&&g(r,F)&&"index_bracket"===G.type)return E(r,D).slice(w(r,L)-1,w(r,F))}throw Error("Command not recognised: '".concat(e,"'"))}}function U(e,r,t,n){r(Object(m.a)({},e,Object(p.a)({},t,n)))}function J(e,r){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return Array(Math.floor((r-e)/t)+1).fill(0).map(function(r,n){return n*t+e})}function W(e){return e}function _(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;if("operator"!==e.type)return!1;var t="<-"===e.value||"\u2190"===e.value?"left":("->"===e.value||"\u2192"===e.value)&&"right";return t&&(!r||r===t)}var P="R_VARIABLES";var T=function(){var e=a.a.useState([]),r=Object(i.a)(e,2),t=r[0],n=r[1],o=a.a.useState(function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};try{var t=localStorage.getItem(e);return t?JSON.parse(t):r}catch(n){return r}}(P)),u=Object(i.a)(o,2),l=u[0],f=u[1];function p(e){var r,t;f(e),r=P,t=e,localStorage.setItem(r,JSON.stringify(t))}return a.a.createElement("div",{className:"App"},a.a.createElement("div",{className:"App-Variables"},a.a.createElement(h,{variables:l,setVariables:p})),a.a.createElement("div",{className:"App-Console"},a.a.createElement(s,{history:t,sendCommand:function(e){var r,a=[].concat(Object(c.a)(t),[{id:t.length+1,type:"input",content:e}]);try{var o=(r=B(e,l,p))instanceof V?r.toString().split("\n"):[JSON.stringify(r)],u=2,i=!0,s=!1,f=void 0;try{for(var m,v=o[Symbol.iterator]();!(i=(m=v.next()).done);i=!0){var h=m.value;a.push({id:t.length+u++,type:"output",content:h})}}catch(y){s=!0,f=y}finally{try{i||null==v.return||v.return()}finally{if(s)throw f}}}catch(d){a.push({id:t.length+2,type:"error",content:d.message})}n(a)},performReplacement:!0})),a.a.createElement("div",{className:"App-Graph"},a.a.createElement(y,null)))},D=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function M(e,r){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var t=e.installing;null!=t&&(t.onstatechange=function(){"installed"===t.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),r&&r.onUpdate&&r.onUpdate(e)):(console.log("Content is cached for offline use."),r&&r.onSuccess&&r.onSuccess(e)))})}}).catch(function(e){console.error("Error during service worker registration:",e)})}u.a.render(a.a.createElement(T,null),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/R",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",function(){var r="".concat("/R","/service-worker.js");D?(function(e,r){fetch(e).then(function(t){var n=t.headers.get("content-type");404===t.status||null!=n&&-1===n.indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):M(e,r)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(r,e),navigator.serviceWorker.ready.then(function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")})):M(r,e)})}}()}},[[15,1,2]]]);
//# sourceMappingURL=main.5df1f387.chunk.js.map