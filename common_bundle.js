///#source 1 1 /helpers/helpers_bundle.js
///#source 1 1 /helpers/InstanceLoader.js
var Helpers;
(function (Helpers) {
    var InstanceLoader = (function () {
        function InstanceLoader(context) {
            var subContexts = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                subContexts[_i] = arguments[_i + 1];
            }
            this.context = context;
            this.subcontexts = subContexts;
        }
        InstanceLoader.prototype.getInstance = function (name) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            var classContext = this.context;
            if (this.subcontexts)
                for (var i = 0; i < this.subcontexts.length; i++) {
                    var pathPart = this.subcontexts[i];
                    classContext = classContext[pathPart];
                }
            var instance = Object.create(classContext[name].prototype);
            instance.constructor.apply(instance, args);
            return instance;
        };
        return InstanceLoader;
    })();
    Helpers.InstanceLoader = InstanceLoader;
})(Helpers || (Helpers = {}));
//# sourceMappingURL=InstanceLoader.js.map

///#source 1 1 /helpers/nodeHelper.js
var Helpers;
(function (Helpers) {
    var NodeHelper = (function () {
        function NodeHelper() {
        }
        NodeHelper.getAllElementsWithAttribute = function (parent, attribute) {
            var matchingElements = [];
            var allElements = parent.getElementsByTagName('*');
            for (var i = 0, n = allElements.length; i < n; i++) {
                var el = allElements[i];
                var defer = el.attributes.getNamedItem(attribute);
                if (defer) {
                    matchingElements.push({ element: el, target: defer.value });
                }
            }
            return matchingElements;
        };
        return NodeHelper;
    })();
    Helpers.NodeHelper = NodeHelper;
})(Helpers || (Helpers = {}));
//# sourceMappingURL=nodeHelper.js.map

///#source 1 1 /Events/Event.js
var Events;
(function (Events) {
    var Event = (function () {
        function Event() {
            this.listeners = [];
            this.priorities = [];
        }
        Event.prototype.add = function (listener, priority) {
            if (typeof priority === "undefined") { priority = 0; }
            var index = this.listeners.indexOf(listener);
            if (index !== -1) {
                this.priorities[index] = priority;
                return;
            }
            for (var i = 0, l = this.priorities.length; i < l; i++) {
                if (this.priorities[i] < priority) {
                    this.priorities.splice(i, 0, priority);
                    this.listeners.splice(i, 0, listener);
                    return;
                }
            }
            this.priorities.push(priority);
            this.listeners.push(listener);
        };

        Event.prototype.remove = function (listener) {
            var index = this.listeners.indexOf(listener);
            if (index >= 0) {
                this.priorities.splice(index, 1);
                this.listeners.splice(index, 1);
            }
        };

        Event.prototype.dispatch = function (parameter) {
            var indexesToRemove;
            var hasBeenCanceled = this.listeners.every(function (listener) {
                var result = listener(parameter);
                return result !== false;
            });

            return hasBeenCanceled;
        };

        Event.prototype.clear = function () {
            this.listeners = [];
            this.priorities = [];
        };

        Event.prototype.hasListeners = function () {
            return this.listeners.length > 0;
        };
        return Event;
    })();
    Events.Event = Event;
})(Events || (Events = {}));
//# sourceMappingURL=Event.js.map


///#source 1 1 /Presenting/presenting_bundle.js
///#source 1 1 /Presenting/libs/libs.min.js
(function(n){function u(n,t,i,r,u){this._listener=t;this._isOnce=i;this.context=r;this._signal=n;this._priority=u||0}function r(n,t){if(typeof n!="function")throw Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}",t));}function t(){this._bindings=[];this._prevParams=null;var n=this;this.dispatch=function(){t.prototype.dispatch.apply(n,arguments)}}u.prototype={active:!0,params:null,execute:function(n){var t;return this.active&&this._listener&&(n=this.params?this.params.concat(n):n,t=this._listener.apply(this.context,n),this._isOnce&&this.detach()),t},detach:function(){return this.isBound()?this._signal.remove(this._listener,this.context):null},isBound:function(){return!!this._signal&&!!this._listener},isOnce:function(){return this._isOnce},getListener:function(){return this._listener},getSignal:function(){return this._signal},_destroy:function(){delete this._signal;delete this._listener;delete this.context},toString:function(){return"[SignalBinding isOnce:"+this._isOnce+", isBound:"+this.isBound()+", active:"+this.active+"]"}};t.prototype={VERSION:"1.0.0",memorize:!1,_shouldPropagate:!0,active:!0,_registerListener:function(n,t,i,r){var f=this._indexOfListener(n,i);if(f!==-1){if(n=this._bindings[f],n.isOnce()!==t)throw Error("You cannot add"+(t?"":"Once")+"() then add"+(t?"Once":"")+"() the same listener without removing the relationship first.");}else n=new u(this,n,t,i,r),this._addBinding(n);return this.memorize&&this._prevParams&&n.execute(this._prevParams),n},_addBinding:function(n){var t=this._bindings.length;do--t;while(this._bindings[t]&&n._priority<=this._bindings[t]._priority);this._bindings.splice(t+1,0,n)},_indexOfListener:function(n,t){for(var i=this._bindings.length,r;i--;)if(r=this._bindings[i],r._listener===n&&r.context===t)return i;return-1},has:function(n,t){return this._indexOfListener(n,t)!==-1},add:function(n,t,i){return r(n,"add"),this._registerListener(n,!1,t,i)},addOnce:function(n,t,i){return r(n,"addOnce"),this._registerListener(n,!0,t,i)},remove:function(n,t){r(n,"remove");var i=this._indexOfListener(n,t);return i!==-1&&(this._bindings[i]._destroy(),this._bindings.splice(i,1)),n},removeAll:function(){for(var n=this._bindings.length;n--;)this._bindings[n]._destroy();this._bindings.length=0},getNumListeners:function(){return this._bindings.length},halt:function(){this._shouldPropagate=!1},dispatch:function(){if(this.active){var i=Array.prototype.slice.call(arguments),n=this._bindings.length,t;if(this.memorize&&(this._prevParams=i),n){t=this._bindings.slice();this._shouldPropagate=!0;do n--;while(t[n]&&this._shouldPropagate&&t[n].execute(i)!==!1)}}},forget:function(){this._prevParams=null},dispose:function(){this.removeAll();delete this._bindings;delete this._prevParams},toString:function(){return"[Signal active:"+this.active+" numListeners:"+this.getNumListeners()+"]"}};var i=t;i.Signal=t;typeof define=="function"&&define.amd?define(function(){return i}):typeof module!="undefined"&&module.exports?module.exports=i:n.signals=i})(this);
/** @license
 * crossroads <http://millermedeiros.github.com/crossroads.js/>
 * Author: Miller Medeiros | MIT License
 * v0.12.0 (2013/01/21 13:47)
 */
(function(){var n=function(n){function i(n,t){if(n.indexOf)return n.indexOf(t);for(var i=n.length;i--;)if(n[i]===t)return i;return-1}function o(n,t){var r=i(n,t);r!==-1&&n.splice(r,1)}function s(n,t){return"[object "+t+"]"===Object.prototype.toString.call(n)}function h(n){return s(n,"RegExp")}function a(n){return s(n,"Array")}function c(n){return typeof n=="function"}function u(n){return n===null||n==="null"?null:n==="true"?!0:n==="false"?!1:n===e||n==="undefined"?e:n===""||isNaN(n)?n:parseFloat(n)}function v(n){for(var t=n.length,i=[];t--;)i[t]=u(n[t]);return i}function y(n,t){for(var f=(n||"").replace("?","").split("&"),e=f.length,o={},i,r;e--;)i=f[e].split("="),r=t?u(i[1]):i[1],o[i[0]]=typeof r=="string"?decodeURIComponent(r):r;return o}function r(){this.bypassed=new n.Signal;this.routed=new n.Signal;this._routes=[];this._prevRoutes=[];this._piped=[];this.resetState()}function l(t,i,r,u){var f=h(t),e=u.patternLexer;this._router=u;this._pattern=t;this._paramsIds=f?null:e.getParamIds(t);this._optionalParamsIds=f?null:e.getOptionalParamsIds(t);this._matchRegexp=f?t:e.compilePattern(t,u.ignoreCase);this.matched=new n.Signal;this.switched=new n.Signal;i&&this.matched.add(i);this._priority=r||0}var t,f,e;return f=/t(.+)?/.exec("t")[1]==="",r.prototype={greedy:!1,greedyEnabled:!0,ignoreCase:!0,ignoreState:!1,shouldTypecast:!1,normalizeFn:null,resetState:function(){this._prevRoutes.length=0;this._prevMatchedRequest=null;this._prevBypassedRequest=null},create:function(){return new r},addRoute:function(n,t,i){var r=new l(n,t,i,this);return this._sortedInsert(r),r},removeRoute:function(n){o(this._routes,n);n._destroy()},removeAllRoutes:function(){for(var n=this.getNumRoutes();n--;)this._routes[n]._destroy();this._routes.length=0},parse:function(n,t){if(n=n||"",t=t||[],this.ignoreState||n!==this._prevMatchedRequest&&n!==this._prevBypassedRequest){var r=this._getMatchedRoutes(n),u=0,f=r.length,i;if(f)for(this._prevMatchedRequest=n,this._notifyPrevRoutes(r,n),this._prevRoutes=r;u<f;)i=r[u],i.route.matched.dispatch.apply(i.route.matched,t.concat(i.params)),i.isFirst=!u,this.routed.dispatch.apply(this.routed,t.concat([n,i])),u+=1;else this._prevBypassedRequest=n,this.bypassed.dispatch.apply(this.bypassed,t.concat([n]));this._pipeParse(n,t)}},_notifyPrevRoutes:function(n,t){for(var r=0,i;i=this._prevRoutes[r++];)i.route.switched&&this._didSwitch(i.route,n)&&i.route.switched.dispatch(t)},_didSwitch:function(n,t){for(var i,r=0;i=t[r++];)if(i.route===n)return!1;return!0},_pipeParse:function(n,t){for(var r=0,i;i=this._piped[r++];)i.parse(n,t)},getNumRoutes:function(){return this._routes.length},_sortedInsert:function(n){var t=this._routes,i=t.length;do--i;while(t[i]&&n._priority<=t[i]._priority);t.splice(i+1,0,n)},_getMatchedRoutes:function(n){for(var i=[],r=this._routes,u=r.length,t;t=r[--u];)if((!i.length||this.greedy||t.greedy)&&t.match(n)&&i.push({route:t,params:t._getParamsArray(n)}),!this.greedyEnabled&&i.length)break;return i},pipe:function(n){this._piped.push(n)},unpipe:function(n){o(this._piped,n)},toString:function(){return"[crossroads numRoutes:"+this.getNumRoutes()+"]"}},t=new r,t.VERSION="0.12.0",t.NORM_AS_ARRAY=function(n,t){return[t.vals_]},t.NORM_AS_OBJECT=function(n,t){return[t]},l.prototype={greedy:!1,rules:void 0,match:function(n){return n=n||"",this._matchRegexp.test(n)&&this._validateParams(n)},_validateParams:function(n){var i=this.rules,r=this._getParamsObject(n);for(var t in i)if(t!=="normalize_"&&i.hasOwnProperty(t)&&!this._isValidParam(n,t,r))return!1;return!0},_isValidParam:function(n,t,r){var u=this.rules[t],f=r[t],e=!1,o=t.indexOf("?")===0;return f==null&&this._optionalParamsIds&&i(this._optionalParamsIds,t)!==-1?e=!0:h(u)?(o&&(f=r[t+"_"]),e=u.test(f)):a(u)?(o&&(f=r[t+"_"]),e=this._isValidArrayRule(u,f)):c(u)&&(e=u(f,n,r)),e},_isValidArrayRule:function(n,t){if(!this._router.ignoreCase)return i(n,t)!==-1;typeof t=="string"&&(t=t.toLowerCase());for(var u=n.length,r,f;u--;)if(r=n[u],f=typeof r=="string"?r.toLowerCase():r,f===t)return!0;return!1},_getParamsObject:function(n){for(var h=this._router.shouldTypecast,o=this._router.patternLexer.getParamValues(n,this._matchRegexp,h),r={},e=o.length,s,t;e--;)t=o[e],this._paramsIds&&(s=this._paramsIds[e],s.indexOf("?")===0&&t&&(r[s+"_"]=t,t=y(t,h),o[e]=t),f&&t===""&&i(this._optionalParamsIds,s)!==-1&&(t=void 0,o[e]=t),r[s]=t),r[e]=t;return r.request_=h?u(n):n,r.vals_=o,r},_getParamsArray:function(n){var t=this.rules?this.rules.normalize_:null;return t=t||this._router.normalizeFn,t&&c(t)?t(n,this._getParamsObject(n)):this._getParamsObject(n).vals_},interpolate:function(n){var t=this._router.patternLexer.interpolate(this._pattern,n);if(!this._validateParams(t))throw new Error("Generated string doesn't validate against `Route.rules`.");return t},dispose:function(){this._router.removeRoute(this)},_destroy:function(){this.matched.dispose();this.switched.dispose();this.matched=this.switched=this._pattern=this._matchRegexp=null},toString:function(){return'[Route pattern:"'+this._pattern+'", numListeners:'+this.matched.getNumListeners()+"]"}},r.prototype.patternLexer=function(){function l(){var i,t;for(i in n)n.hasOwnProperty(i)&&(t=n[i],t.id="__CR_"+i+"__",t.save="save"in t?t.save.replace("{{id}}",t.id):t.id,t.rRestore=new RegExp(t.id,"g"))}function e(n,t){var i=[],r;for(n.lastIndex=0;r=n.exec(t);)i.push(r[1]);return i}function a(n){return e(r,n)}function y(t){return e(n.OP.rgx,t)}function p(n,r){return n=n||"",n&&(t===i?n=n.replace(h,""):t===f&&(n=n.replace(c,"")),n=o(n,"rgx","save"),n=n.replace(s,"\\$&"),n=o(n,"rRestore","res"),t===i&&(n="\\/?"+n)),t!==u&&(n+="\\/?"),new RegExp("^"+n+"$",r?"i":"")}function o(t,i,r){var u;for(var f in n)n.hasOwnProperty(f)&&(u=n[f],t=t.replace(u[i],u[r]));return t}function w(n,t,i){var r=t.exec(n);return r&&(r.shift(),i&&(r=v(r))),r}function b(t,i){if(typeof t!="string")throw new Error("Route pattern should be a string.");var u=function(n,t){var r,u,f;if(t=t.substr(0,1)==="?"?t.substr(1):t,i[t]!=null){if(typeof i[t]=="object"){u=[];for(f in i[t])u.push(encodeURI(f+"="+i[t][f]));r="?"+u.join("&")}else r=String(i[t]);if(n.indexOf("*")===-1&&r.indexOf("/")!==-1)throw new Error('Invalid value "'+r+'" for segment "'+n+'".');}else if(n.indexOf("{")!==-1)throw new Error("The segment "+n+" is required.");else r="";return r};return n.OS.trail||(n.OS.trail=new RegExp("(?:"+n.OS.id+")+$")),t.replace(n.OS.rgx,n.OS.save).replace(r,u).replace(n.OS.trail,"").replace(n.OS.rRestore,"/")}var s=/[\\.+*?\^$\[\](){}\/'#]/g,h=/^\/|\/$/g,c=/\/$/g,r=/(?:\{|:)([^}:]+)(?:\}|:)/g,n={OS:{rgx:/([:}]|\w(?=\/))\/?(:|(?:\{\?))/g,save:"$1{{id}}$2",res:"\\/?"},RS:{rgx:/([:}])\/?(\{)/g,save:"$1{{id}}$2",res:"\\/"},RQ:{rgx:/\{\?([^}]+)\}/g,res:"\\?([^#]+)"},OQ:{rgx:/:\?([^:]+):/g,res:"(?:\\?([^#]*))?"},OR:{rgx:/:([^:]+)\*:/g,res:"(.*)?"},RR:{rgx:/\{([^}]+)\*\}/g,res:"(.+)"},RP:{rgx:/\{([^}]+)\}/g,res:"([^\\/?]+)"},OP:{rgx:/:([^:]+):/g,res:"([^\\/?]+)?/?"}},i=1,u=2,f=3,t=i;return l(),{strict:function(){t=u},loose:function(){t=i},legacy:function(){t=f},getParamIds:a,getOptionalParamsIds:y,getParamValues:w,compilePattern:p,interpolate:b}}(),t};typeof define=="function"&&define.amd?define(["signals"],n):typeof module!="undefined"&&module.exports?module.exports=n(require("signals")):window.crossroads=n(window.signals)})();typeof JSON!="object"&&(JSON={}),function(){"use strict";function i(n){return n<10?"0"+n:n}function f(n){return o.lastIndex=0,o.test(n)?'"'+n.replace(o,function(n){var t=s[n];return typeof t=="string"?t:"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+n+'"'}function r(i,e){var s,l,h,a,v=n,c,o=e[i];o&&typeof o=="object"&&typeof o.toJSON=="function"&&(o=o.toJSON(i));typeof t=="function"&&(o=t.call(e,i,o));switch(typeof o){case"string":return f(o);case"number":return isFinite(o)?String(o):"null";case"boolean":case"null":return String(o);case"object":if(!o)return"null";if(n+=u,c=[],Object.prototype.toString.apply(o)==="[object Array]"){for(a=o.length,s=0;s<a;s+=1)c[s]=r(s,o)||"null";return h=c.length===0?"[]":n?"[\n"+n+c.join(",\n"+n)+"\n"+v+"]":"["+c.join(",")+"]",n=v,h}if(t&&typeof t=="object")for(a=t.length,s=0;s<a;s+=1)typeof t[s]=="string"&&(l=t[s],h=r(l,o),h&&c.push(f(l)+(n?": ":":")+h));else for(l in o)Object.prototype.hasOwnProperty.call(o,l)&&(h=r(l,o),h&&c.push(f(l)+(n?": ":":")+h));return h=c.length===0?"{}":n?"{\n"+n+c.join(",\n"+n)+"\n"+v+"}":"{"+c.join(",")+"}",n=v,h}}typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+i(this.getUTCMonth()+1)+"-"+i(this.getUTCDate())+"T"+i(this.getUTCHours())+":"+i(this.getUTCMinutes())+":"+i(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var e=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,o=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,n,u,s={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},t;typeof JSON.stringify!="function"&&(JSON.stringify=function(i,f,e){var o;if(n="",u="",typeof e=="number")for(o=0;o<e;o+=1)u+=" ";else typeof e=="string"&&(u=e);if(t=f,!f||typeof f=="function"||typeof f=="object"&&typeof f.length=="number")return r("",{"":i});throw new Error("JSON.stringify");});typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(n,t){var r,u,i=n[t];if(i&&typeof i=="object")for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(u=walk(i,r),u!==undefined?i[r]=u:delete i[r]);return reviver.call(n,t,i)}var j;if(text=String(text),e.lastIndex=0,e.test(text)&&(text=text.replace(e,function(n){return"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse");})}(),function(n,t){"use strict";var i=n.History=n.History||{};if(typeof i.Adapter!="undefined")throw new Error("History.js Adapter has already been loaded...");i.Adapter={handlers:{},_uid:1,uid:function(n){return n._uid||(n._uid=i.Adapter._uid++)},bind:function(n,t,r){var u=i.Adapter.uid(n);i.Adapter.handlers[u]=i.Adapter.handlers[u]||{};i.Adapter.handlers[u][t]=i.Adapter.handlers[u][t]||[];i.Adapter.handlers[u][t].push(r);n["on"+t]=function(n,t){return function(r){i.Adapter.trigger(n,t,r)}}(n,t)},trigger:function(n,t,r){r=r||{};var u=i.Adapter.uid(n),f,e;for(i.Adapter.handlers[u]=i.Adapter.handlers[u]||{},i.Adapter.handlers[u][t]=i.Adapter.handlers[u][t]||[],f=0,e=i.Adapter.handlers[u][t].length;f<e;++f)i.Adapter.handlers[u][t][f].apply(this,[r])},extractEventData:function(n,i){return i&&i[n]||t},onDomLoad:function(t){var i=n.setTimeout(function(){t()},2e3);n.onload=function(){clearTimeout(i);t()}}};typeof i.init!="undefined"&&i.init()}(window),function(n){"use strict";var i=n.document,u=n.setTimeout||u,f=n.clearTimeout||f,r=n.setInterval||r,t=n.History=n.History||{};if(typeof t.initHtml4!="undefined")throw new Error("History.js HTML4 Support has already been loaded...");t.initHtml4=function(){if(typeof t.initHtml4.initialized!="undefined")return!1;t.initHtml4.initialized=!0;t.enabled=!0;t.savedHashes=[];t.isLastHash=function(n){var r=t.getHashByIndex(),i;return i=n===r,i};t.isHashEqual=function(n,t){return n=encodeURIComponent(n).replace(/%25/g,"%"),t=encodeURIComponent(t).replace(/%25/g,"%"),n===t};t.saveHash=function(n){return t.isLastHash(n)?!1:(t.savedHashes.push(n),!0)};t.getHashByIndex=function(n){var i=null;return i=typeof n=="undefined"?t.savedHashes[t.savedHashes.length-1]:n<0?t.savedHashes[t.savedHashes.length+n]:t.savedHashes[n],i};t.discardedHashes={};t.discardedStates={};t.discardState=function(n,i,r){var f=t.getHashByState(n),u;return u={discardedState:n,backState:r,forwardState:i},t.discardedStates[f]=u,!0};t.discardHash=function(n,i,r){var u={discardedHash:n,backState:r,forwardState:i};return t.discardedHashes[n]=u,!0};t.discardedState=function(n){var r=t.getHashByState(n),i;return i=t.discardedStates[r]||!1,i};t.discardedHash=function(n){return t.discardedHashes[n]||!1};t.recycleState=function(n){var i=t.getHashByState(n);return t.discardedState(n)&&delete t.discardedStates[i],!0};t.emulated.hashChange&&(t.hashChangeInit=function(){t.checkerFunction=null;var f="",s,u,e,o,h=Boolean(t.getHash());return t.isInternetExplorer()?(s="historyjs-iframe",u=i.createElement("iframe"),u.setAttribute("id",s),u.setAttribute("src","#"),u.style.display="none",i.body.appendChild(u),u.contentWindow.document.open(),u.contentWindow.document.close(),e="",o=!1,t.checkerFunction=function(){if(o)return!1;o=!0;var r=t.getHash(),i=t.getHash(u.contentWindow.document);return r!==f?(f=r,i!==r&&(e=i=r,u.contentWindow.document.open(),u.contentWindow.document.close(),u.contentWindow.document.location.hash=t.escapeHash(r)),t.Adapter.trigger(n,"hashchange")):i!==e&&(e=i,h&&i===""?t.back():t.setHash(i,!1)),o=!1,!0}):t.checkerFunction=function(){var i=t.getHash()||"";return i!==f&&(f=i,t.Adapter.trigger(n,"hashchange")),!0},t.intervalList.push(r(t.checkerFunction,t.options.hashChangeInterval)),!0},t.Adapter.onDomLoad(t.hashChangeInit));t.emulated.pushState&&(t.onHashChange=function(i){var e=i&&i.newURL||t.getLocationHref(),u=t.getHashByUrl(e),r=null,o=null,f;return t.isLastHash(u)?(t.busy(!1),!1):(t.doubleCheckComplete(),t.saveHash(u),u&&t.isTraditionalAnchor(u)?(t.Adapter.trigger(n,"anchorchange"),t.busy(!1),!1):(r=t.extractState(t.getFullUrl(u||t.getLocationHref()),!0),t.isLastSavedState(r)?(t.busy(!1),!1):(o=t.getHashByState(r),f=t.discardedState(r),f?(t.getHashByIndex(-2)===t.getHashByState(f.forwardState)?t.back(!1):t.forward(!1),!1):(t.pushState(r.data,r.title,encodeURI(r.url),!1),!0))))},t.Adapter.bind(n,"hashchange",t.onHashChange),t.pushState=function(i,r,u,f){if(u=encodeURI(u).replace(/%25/g,"%"),t.getHashByUrl(u))throw new Error("History.js does not support states with fragment-identifiers (hashes/anchors).");if(f!==!1&&t.busy())return t.pushQueue({scope:t,callback:t.pushState,args:arguments,queue:f}),!1;t.busy(!0);var e=t.createStateObject(i,r,u),o=t.getHashByState(e),s=t.getState(!1),h=t.getHashByState(s),c=t.getHash(),l=t.expectedStateId==e.id;return t.storeState(e),t.expectedStateId=e.id,t.recycleState(e),t.setTitle(e),o===h?(t.busy(!1),!1):(t.saveState(e),l||t.Adapter.trigger(n,"statechange"),!t.isHashEqual(o,c)&&!t.isHashEqual(o,t.getShortUrl(t.getLocationHref()))&&t.setHash(o,!1),t.busy(!1),!0)},t.replaceState=function(i,r,u,f){if(u=encodeURI(u).replace(/%25/g,"%"),t.getHashByUrl(u))throw new Error("History.js does not support states with fragment-identifiers (hashes/anchors).");if(f!==!1&&t.busy())return t.pushQueue({scope:t,callback:t.replaceState,args:arguments,queue:f}),!1;t.busy(!0);var e=t.createStateObject(i,r,u),s=t.getHashByState(e),o=t.getState(!1),h=t.getHashByState(o),c=t.getStateByIndex(-2);return t.discardState(o,e,c),s===h?(t.storeState(e),t.expectedStateId=e.id,t.recycleState(e),t.setTitle(e),t.saveState(e),t.Adapter.trigger(n,"statechange"),t.busy(!1)):t.pushState(e.data,e.title,e.url,!1),!0});t.emulated.pushState&&t.getHash()&&!t.emulated.hashChange&&t.Adapter.onDomLoad(function(){t.Adapter.trigger(n,"hashchange")})};typeof t.init!="undefined"&&t.init()}(window),function(n,t){"use strict";var e=n.console||t,r=n.document,o=n.navigator,f=n.sessionStorage||!1,h=n.setTimeout,c=n.clearTimeout,l=n.setInterval,a=n.clearInterval,u=n.JSON,v=n.alert,i=n.History=n.History||{},s=n.history;try{f.setItem("TEST","1");f.removeItem("TEST")}catch(y){f=!1}if(u.stringify=u.stringify||u.encode,u.parse=u.parse||u.decode,typeof i.init!="undefined")throw new Error("History.js Core has already been loaded...");i.init=function(){return typeof i.Adapter=="undefined"?!1:(typeof i.initCore!="undefined"&&i.initCore(),typeof i.initHtml4!="undefined"&&i.initHtml4(),!0)};i.initCore=function(){if(typeof i.initCore.initialized!="undefined")return!1;if(i.initCore.initialized=!0,i.options=i.options||{},i.options.hashChangeInterval=i.options.hashChangeInterval||100,i.options.safariPollInterval=i.options.safariPollInterval||500,i.options.doubleCheckInterval=i.options.doubleCheckInterval||500,i.options.disableSuid=i.options.disableSuid||!1,i.options.storeInterval=i.options.storeInterval||1e3,i.options.busyDelay=i.options.busyDelay||250,i.options.debug=i.options.debug||!1,i.options.initialTitle=i.options.initialTitle||r.title,i.options.html4Mode=i.options.html4Mode||!1,i.options.delayInit=i.options.delayInit||!1,i.intervalList=[],i.clearAllIntervals=function(){var n,t=i.intervalList;if(typeof t!="undefined"&&t!==null){for(n=0;n<t.length;n++)a(t[n]);i.intervalList=null}},i.debug=function(){(i.options.debug||!1)&&i.log.apply(i,arguments)},i.log=function(){var s=typeof e!="undefined"&&typeof e.log!="undefined"&&typeof e.log.apply!="undefined",t=r.getElementById("log"),n,f,h,o,i;for(s?(o=Array.prototype.slice.call(arguments),n=o.shift(),typeof e.debug!="undefined"?e.debug.apply(e,[n,o]):e.log.apply(e,[n,o])):n="\n"+arguments[0]+"\n",f=1,h=arguments.length;f<h;++f){if(i=arguments[f],typeof i=="object"&&typeof u!="undefined")try{i=u.stringify(i)}catch(c){}n+="\n"+i+"\n"}return t?(t.value+=n+"\n-----\n",t.scrollTop=t.scrollHeight-t.clientHeight):s||v(n),!0},i.getInternetExplorerMajorVersion=function(){return i.getInternetExplorerMajorVersion.cached=typeof i.getInternetExplorerMajorVersion.cached!="undefined"?i.getInternetExplorerMajorVersion.cached:function(){for(var n=3,t=r.createElement("div"),i=t.getElementsByTagName("i");(t.innerHTML="<!--[if gt IE "+ ++n+"]><i><\/i><![endif]-->")&&i[0];);return n>4?n:!1}()},i.isInternetExplorer=function(){return i.isInternetExplorer.cached=typeof i.isInternetExplorer.cached!="undefined"?i.isInternetExplorer.cached:Boolean(i.getInternetExplorerMajorVersion())},i.emulated=i.options.html4Mode?{pushState:!0,hashChange:!0}:{pushState:!Boolean(n.history&&n.history.pushState&&n.history.replaceState&&!/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(o.userAgent)&&!/AppleWebKit\/5([0-2]|3[0-2])/i.test(o.userAgent)),hashChange:Boolean(!("onhashchange"in n||"onhashchange"in r)||i.isInternetExplorer()&&i.getInternetExplorerMajorVersion()<8)},i.enabled=!i.emulated.pushState,i.bugs={setHash:Boolean(!i.emulated.pushState&&o.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(o.userAgent)),safariPoll:Boolean(!i.emulated.pushState&&o.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(o.userAgent)),ieDoubleCheck:Boolean(i.isInternetExplorer()&&i.getInternetExplorerMajorVersion()<8),hashEscape:Boolean(i.isInternetExplorer()&&i.getInternetExplorerMajorVersion()<7)},i.isEmptyObject=function(n){for(var t in n)if(n.hasOwnProperty(t))return!1;return!0},i.cloneObject=function(n){var i,t;return n?(i=u.stringify(n),t=u.parse(i)):t={},t},i.getRootUrl=function(){var n=r.location.protocol+"//"+(r.location.hostname||r.location.host);return(r.location.port||!1)&&(n+=":"+r.location.port),n+="/",n},i.getBaseHref=function(){var t=r.getElementsByTagName("base"),i=null,n="";return t.length===1&&(i=t[0],n=i.href.replace(/[^\/]+$/,"")),n=n.replace(/\/+$/,""),n&&(n+="/"),n},i.getBaseUrl=function(){return i.getBaseHref()||i.getBasePageUrl()||i.getRootUrl()},i.getPageUrl=function(){var t=i.getState(!1,!1),r=(t||{}).url||i.getLocationHref(),n;return n=r.replace(/\/+$/,"").replace(/[^\/]+$/,function(n){return/\./.test(n)?n:n+"/"}),n},i.getBasePageUrl=function(){return i.getLocationHref().replace(/[#\?].*/,"").replace(/[^\/]+$/,function(n){return/[^\/]$/.test(n)?"":n}).replace(/\/+$/,"")+"/"},i.getFullUrl=function(n,t){var u=n,r=n.substring(0,1);return t=typeof t=="undefined"?!0:t,/[a-z]+\:\/\//.test(n)||(u=r==="/"?i.getRootUrl()+n.replace(/^\/+/,""):r==="#"?i.getPageUrl().replace(/#.*/,"")+n:r==="?"?i.getPageUrl().replace(/[\?#].*/,"")+n:t?i.getBaseUrl()+n.replace(/^(\.\/)+/,""):i.getBasePageUrl()+n.replace(/^(\.\/)+/,"")),u.replace(/\#$/,"")},i.getShortUrl=function(n){var t=n,r=i.getBaseUrl(),u=i.getRootUrl();return i.emulated.pushState&&(t=t.replace(r,"")),t=t.replace(u,"/"),i.isTraditionalAnchor(t)&&(t="./"+t),t=t.replace(/^(\.\/)+/g,"./").replace(/\#$/,""),t},i.getLocationHref=function(n){return n=n||r,n.URL===n.location.href?n.location.href:n.location.href===decodeURIComponent(n.URL)?n.URL:n.location.hash&&decodeURIComponent(n.location.href.replace(/^[^#]+/,""))===n.location.hash?n.location.href:n.URL.indexOf("#")==-1&&n.location.href.indexOf("#")!=-1?n.location.href:n.URL||n.location.href},i.store={},i.idToState=i.idToState||{},i.stateToId=i.stateToId||{},i.urlToId=i.urlToId||{},i.storedStates=i.storedStates||[],i.savedStates=i.savedStates||[],i.normalizeStore=function(){i.store.idToState=i.store.idToState||{};i.store.urlToId=i.store.urlToId||{};i.store.stateToId=i.store.stateToId||{}},i.getState=function(n,t){typeof n=="undefined"&&(n=!0);typeof t=="undefined"&&(t=!0);var r=i.getLastSavedState();return!r&&t&&(r=i.createStateObject()),n&&(r=i.cloneObject(r),r.url=r.cleanUrl||r.url),r},i.getIdByState=function(n){var t=i.extractId(n.url),r;if(!t)if(r=i.getStateString(n),typeof i.stateToId[r]!="undefined")t=i.stateToId[r];else if(typeof i.store.stateToId[r]!="undefined")t=i.store.stateToId[r];else{for(;;)if(t=(new Date).getTime()+String(Math.random()).replace(/\D/g,""),typeof i.idToState[t]=="undefined"&&typeof i.store.idToState[t]=="undefined")break;i.stateToId[r]=t;i.idToState[t]=n}return t},i.normalizeState=function(n){var t,r;return(n&&typeof n=="object"||(n={}),typeof n.normalized!="undefined")?n:(n.data&&typeof n.data=="object"||(n.data={}),t={},t.normalized=!0,t.title=n.title||"",t.url=i.getFullUrl(n.url?n.url:i.getLocationHref()),t.hash=i.getShortUrl(t.url),t.data=i.cloneObject(n.data),t.id=i.getIdByState(t),t.cleanUrl=t.url.replace(/\??\&_suid.*/,""),t.url=t.cleanUrl,r=!i.isEmptyObject(t.data),(t.title||r)&&i.options.disableSuid!==!0&&(t.hash=i.getShortUrl(t.url).replace(/\??\&_suid.*/,""),/\?/.test(t.hash)||(t.hash+="?"),t.hash+="&_suid="+t.id),t.hashedUrl=i.getFullUrl(t.hash),(i.emulated.pushState||i.bugs.safariPoll)&&i.hasUrlDuplicate(t)&&(t.url=t.hashedUrl),t)},i.createStateObject=function(n,t,r){var u={data:n,title:t,url:r};return u=i.normalizeState(u),u},i.getStateById=function(n){n=String(n);return i.idToState[n]||i.store.idToState[n]||t},i.getStateString=function(n){var t,r,f;return t=i.normalizeState(n),r={data:t.data,title:n.title,url:n.url},f=u.stringify(r),f},i.getStateId=function(n){var t,r;return t=i.normalizeState(n),r=t.id,r},i.getHashByState=function(n){var t,r;return t=i.normalizeState(n),r=t.hash,r},i.extractId=function(n){var i,t,u,r;return r=n.indexOf("#")!=-1?n.split("#")[0]:n,t=/(.*)\&_suid=([0-9]+)$/.exec(r),u=t?t[1]||n:n,i=t?String(t[2]||""):"",i||!1},i.isTraditionalAnchor=function(n){return!/[\/\?\.]/.test(n)},i.extractState=function(n,t){var r=null,u,f;return t=t||!1,u=i.extractId(n),u&&(r=i.getStateById(u)),r||(f=i.getFullUrl(n),u=i.getIdByUrl(f)||!1,u&&(r=i.getStateById(u)),!r&&t&&!i.isTraditionalAnchor(n)&&(r=i.createStateObject(null,null,f))),r},i.getIdByUrl=function(n){return i.urlToId[n]||i.store.urlToId[n]||t},i.getLastSavedState=function(){return i.savedStates[i.savedStates.length-1]||t},i.getLastStoredState=function(){return i.storedStates[i.storedStates.length-1]||t},i.hasUrlDuplicate=function(n){var r=!1,t;return t=i.extractState(n.url),r=t&&t.id!==n.id,r},i.storeState=function(n){return i.urlToId[n.url]=n.id,i.storedStates.push(i.cloneObject(n)),n},i.isLastSavedState=function(n){var t=!1,r,u,f;return i.savedStates.length&&(r=n.id,u=i.getLastSavedState(),f=u.id,t=r===f),t},i.saveState=function(n){return i.isLastSavedState(n)?!1:(i.savedStates.push(i.cloneObject(n)),!0)},i.getStateByIndex=function(n){var t=null;return t=typeof n=="undefined"?i.savedStates[i.savedStates.length-1]:n<0?i.savedStates[i.savedStates.length+n]:i.savedStates[n],t},i.getCurrentIndex=function(){var n=null;return n=i.savedStates.length<1?0:i.savedStates.length-1,n},i.getHash=function(n){var r=i.getLocationHref(n),t;return t=i.getHashByUrl(r),t},i.unescapeHash=function(n){var t=i.normalizeHash(n);return t=decodeURIComponent(t),t},i.normalizeHash=function(n){return n.replace(/[^#]*#/,"").replace(/#.*/,"")},i.setHash=function(n,t){var u,f;return t!==!1&&i.busy()?(i.pushQueue({scope:i,callback:i.setHash,args:arguments,queue:t}),!1):(i.busy(!0),u=i.extractState(n,!0),u&&!i.emulated.pushState?i.pushState(u.data,u.title,u.url,!1):i.getHash()!==n&&(i.bugs.setHash?(f=i.getPageUrl(),i.pushState(null,null,f+"#"+n,!1)):r.location.hash=n),i)},i.escapeHash=function(t){var r=i.normalizeHash(t);return r=n.encodeURIComponent(r),i.bugs.hashEscape||(r=r.replace(/\%21/g,"!").replace(/\%26/g,"&").replace(/\%3D/g,"=").replace(/\%3F/g,"?")),r},i.getHashByUrl=function(n){var t=String(n).replace(/([^#]*)#?([^#]*)#?(.*)/,"$2");return t=i.unescapeHash(t),t},i.setTitle=function(n){var t=n.title,u;t||(u=i.getStateByIndex(0),u&&u.url===n.url&&(t=u.title||i.options.initialTitle));try{r.getElementsByTagName("title")[0].innerHTML=t.replace("<","&lt;").replace(">","&gt;").replace(" & "," &amp; ")}catch(f){}return r.title=t,i},i.queues=[],i.busy=function(n){if(typeof n!="undefined"?i.busy.flag=n:typeof i.busy.flag=="undefined"&&(i.busy.flag=!1),!i.busy.flag){c(i.busy.timeout);var t=function(){var n,r,u;if(!i.busy.flag)for(n=i.queues.length-1;n>=0;--n)(r=i.queues[n],r.length!==0)&&(u=r.shift(),i.fireQueueItem(u),i.busy.timeout=h(t,i.options.busyDelay))};i.busy.timeout=h(t,i.options.busyDelay)}return i.busy.flag},i.busy.flag=!1,i.fireQueueItem=function(n){return n.callback.apply(n.scope||i,n.args||[])},i.pushQueue=function(n){return i.queues[n.queue||0]=i.queues[n.queue||0]||[],i.queues[n.queue||0].push(n),i},i.queue=function(n,t){return typeof n=="function"&&(n={callback:n}),typeof t!="undefined"&&(n.queue=t),i.busy()?i.pushQueue(n):i.fireQueueItem(n),i},i.clearQueue=function(){return i.busy.flag=!1,i.queues=[],i},i.stateChanged=!1,i.doubleChecker=!1,i.doubleCheckComplete=function(){return i.stateChanged=!0,i.doubleCheckClear(),i},i.doubleCheckClear=function(){return i.doubleChecker&&(c(i.doubleChecker),i.doubleChecker=!1),i},i.doubleCheck=function(n){return i.stateChanged=!1,i.doubleCheckClear(),i.bugs.ieDoubleCheck&&(i.doubleChecker=h(function(){return i.doubleCheckClear(),i.stateChanged||n(),!0},i.options.doubleCheckInterval)),i},i.safariStatePoll=function(){var r=i.extractState(i.getLocationHref()),t;if(!i.isLastSavedState(r))return t=r,t||(t=i.createStateObject()),i.Adapter.trigger(n,"popstate"),i},i.back=function(n){return n!==!1&&i.busy()?(i.pushQueue({scope:i,callback:i.back,args:arguments,queue:n}),!1):(i.busy(!0),i.doubleCheck(function(){i.back(!1)}),s.go(-1),!0)},i.forward=function(n){return n!==!1&&i.busy()?(i.pushQueue({scope:i,callback:i.forward,args:arguments,queue:n}),!1):(i.busy(!0),i.doubleCheck(function(){i.forward(!1)}),s.go(1),!0)},i.go=function(n,t){var r;if(n>0)for(r=1;r<=n;++r)i.forward(t);else{if(!(n<0))throw new Error("History.go: History.go requires a positive or negative integer passed.");for(r=-1;r>=n;--r)i.back(t)}return i},i.emulated.pushState){var y=function(){};i.pushState=i.pushState||y;i.replaceState=i.replaceState||y}else i.onPopState=function(t,r){var e=!1,u=!1,o,f;return i.doubleCheckComplete(),o=i.getHash(),o?(f=i.extractState(o||i.getLocationHref(),!0),f?i.replaceState(f.data,f.title,f.url,!1):(i.Adapter.trigger(n,"anchorchange"),i.busy(!1)),i.expectedStateId=!1,!1):(e=i.Adapter.extractEventData("state",t,r)||!1,u=e?i.getStateById(e):i.expectedStateId?i.getStateById(i.expectedStateId):i.extractState(i.getLocationHref()),u||(u=i.createStateObject(null,null,i.getLocationHref())),i.expectedStateId=!1,i.isLastSavedState(u)?(i.busy(!1),!1):(i.storeState(u),i.saveState(u),i.setTitle(u),i.Adapter.trigger(n,"statechange"),i.busy(!1),!0))},i.Adapter.bind(n,"popstate",i.onPopState),i.pushState=function(t,r,u,f){if(i.getHashByUrl(u)&&i.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(f!==!1&&i.busy())return i.pushQueue({scope:i,callback:i.pushState,args:arguments,queue:f}),!1;i.busy(!0);var e=i.createStateObject(t,r,u);return i.isLastSavedState(e)?i.busy(!1):(i.storeState(e),i.expectedStateId=e.id,s.pushState(e.id,e.title,e.url),i.Adapter.trigger(n,"popstate")),!0},i.replaceState=function(t,r,u,f){if(i.getHashByUrl(u)&&i.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(f!==!1&&i.busy())return i.pushQueue({scope:i,callback:i.replaceState,args:arguments,queue:f}),!1;i.busy(!0);var e=i.createStateObject(t,r,u);return i.isLastSavedState(e)?i.busy(!1):(i.storeState(e),i.expectedStateId=e.id,s.replaceState(e.id,e.title,e.url),i.Adapter.trigger(n,"popstate")),!0};if(f){try{i.store=u.parse(f.getItem("History.store"))||{}}catch(p){i.store={}}i.normalizeStore()}else i.store={},i.normalizeStore();i.Adapter.bind(n,"unload",i.clearAllIntervals);i.saveState(i.storeState(i.extractState(i.getLocationHref(),!0)));f&&(i.onUnload=function(){var n,t,r;try{n=u.parse(f.getItem("History.store"))||{}}catch(o){n={}}n.idToState=n.idToState||{};n.urlToId=n.urlToId||{};n.stateToId=n.stateToId||{};for(t in i.idToState)i.idToState.hasOwnProperty(t)&&(n.idToState[t]=i.idToState[t]);for(t in i.urlToId)i.urlToId.hasOwnProperty(t)&&(n.urlToId[t]=i.urlToId[t]);for(t in i.stateToId)i.stateToId.hasOwnProperty(t)&&(n.stateToId[t]=i.stateToId[t]);i.store=n;i.normalizeStore();r=u.stringify(n);try{f.setItem("History.store",r)}catch(e){if(e.code!==DOMException.QUOTA_EXCEEDED_ERR)throw e;f.length&&(f.removeItem("History.store"),f.setItem("History.store",r))}},i.intervalList.push(l(i.onUnload,i.options.storeInterval)),i.Adapter.bind(n,"beforeunload",i.onUnload),i.Adapter.bind(n,"unload",i.onUnload));i.emulated.pushState||(i.bugs.safariPoll&&i.intervalList.push(l(i.safariStatePoll,i.options.safariPollInterval)),(o.vendor==="Apple Computer, Inc."||(o.appCodeName||"")==="Mozilla")&&(i.Adapter.bind(n,"hashchange",function(){i.Adapter.trigger(n,"popstate")}),i.getHash()&&i.Adapter.onDomLoad(function(){i.Adapter.trigger(n,"hashchange")})))};(!i.options||!i.options.delayInit)&&i.init()}(window);
/*
//# sourceMappingURL=libs.min.js.map
*/
///#source 1 1 /Presenting/routing.js
/// <reference path="../history.d.ts" />
/// <reference path="../crossroads.d.ts" />
/// <reference path="../history.d.ts" />
/// <reference path="../events/event.ts" />
var Presenting;
(function (Presenting) {
    var Event = Events.Event;

    var Routing = (function () {
        function Routing() {
            var _this = this;
            this.historyjs = History;
            this.routes = {};
            this.hashBackStack = new Array();
            this.historyjs.Adapter.bind(window, 'statechange', function () {
                return _this.onHashChange();
            });
            this.goBackRequested = new Event();
            this.onHashChange();
        }
        Routing.prototype.addRoute = function (path, callback) {
            var _this = this;
            console.log("Adding Route", path);
            var route = crossroads.addRoute(path, function () {
                var params = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    params[_i] = arguments[_i + 0];
                }
                if (callback)
                    callback(params);
                else
                    $(_this).trigger(Routing.routeParsed, params);
            });
        };

        Routing.prototype.parse = function (url) {
            console.log("parsing", url);
            crossroads.parse(url);
        };
        Routing.prototype.goback = function () {
            this.historyjs.back();
        };

        Routing.prototype.onHashChange = function () {
            var state = this.historyjs.getState();
            this.parameter = state.data;

            console.log("History STATE", state);

            if (state.hash) {
                var hash = state.hash.replace(".", "");
                hash = hash.replace("//", "/");
                hash = hash.replace("#", "");

                if (this.hashBackStack.length > 1) {
                    var previoushash = this.hashBackStack[this.hashBackStack.length - 2];
                    if (previoushash == hash) {
                        console.log("routing gone back");
                        this.hashBackStack.pop();
                        this.hashBackStack.pop();
                        this.goBackRequested.dispatch(hash);
                    }
                } else {
                }

                this.hashBackStack.push(hash);
                console.log(this.hashBackStack);
                this.parse(hash);
            } else {
                console.error("History state has no hash");
            }
        };
        Routing.routeParsed = "routeParsed";
        return Routing;
    })();
    Presenting.Routing = Routing;
})(Presenting || (Presenting = {}));
//# sourceMappingURL=routing.js.map

///#source 1 1 /Presenting/loader.js
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Presenting;
(function (Presenting) {
    var Loader = (function () {
        function Loader(settings) {
            this.cache = {};
            this.settings = settings;
        }
        Loader.prototype.load = function (target, callback) {
            var _this = this;
            target = this.resolveTarget(target);
            if (this.cache[target]) {
                callback(this.cache[target]);
            } else {
                var filename = this.createFileName(target);
                $.ajax(filename).done(function (result) {
                    _this.cache[target] = result;
                    callback(result);
                }).fail(function (xhr, options, r) {
                    console.error("failed to load", target, filename, xhr, options, r);
                    if (target !== "404")
                        _this.load("404", callback);
                });
            }
        };

        Loader.prototype.createFileName = function (target) {
            var file = this.settings.rootDir + "/" + this.settings.targetDir + "/" + target + this.settings.fileNameEnding + this.settings.extension;
            return file;
        };

        Loader.prototype.resolveTarget = function (target) {
            var t = this.settings.mappings[target];
            if (t)
                return t;
            return target;
        };
        return Loader;
    })();
    Presenting.Loader = Loader;

    var ViewLoader = (function (_super) {
        __extends(ViewLoader, _super);
        function ViewLoader(settings) {
            _super.call(this, settings);
        }
        return ViewLoader;
    })(Loader);
    Presenting.ViewLoader = ViewLoader;

    var ViewModelLoader = (function (_super) {
        __extends(ViewModelLoader, _super);
        function ViewModelLoader(settings, instanceLoader) {
            _super.call(this, settings);
            this.instanceLoader = instanceLoader;
        }
        ViewModelLoader.prototype.load = function (target, callback) {
            var _this = this;
            _super.prototype.load.call(this, target, function (js) {
                var first = target.charAt(0).toUpperCase();
                var viewModelname = first + target.substr(1) + "ViewModel";
                var vm = _this.instanceLoader.getInstance(viewModelname);
                callback(vm);
            });
        };
        return ViewModelLoader;
    })(Loader);
    Presenting.ViewModelLoader = ViewModelLoader;
})(Presenting || (Presenting = {}));
//# sourceMappingURL=loader.js.map

///#source 1 1 /Presenting/presenter.js
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../helpers/nodehelper.ts" />
/// <reference path="loader.ts" />
/// <reference path="../events/event.ts" />
/// <reference path="../js-signals.d.ts" />
/// <reference path="modal.ts" />
/// <reference path="routing.ts" />
/// <reference path="presenting.d.ts" />
var Presenting;
(function (Presenting) {
    var NodeHelper = Helpers.NodeHelper;

    var PresentationRequest = (function () {
        function PresentationRequest(target, parameter, viewLoader, viewModelLoader, callback) {
            var _this = this;
            this.callback = callback;
            viewLoader.load(target, function (v) {
                _this.view = v;
                _this.loaderFinished();
            });
            viewModelLoader.load(target, function (vm) {
                _this.viewModel = vm;
                vm.init(parameter);
                _this.loaderFinished();
            });
        }
        PresentationRequest.prototype.loaderFinished = function () {
            if (this.view && this.viewModel)
                this.callback(this.view, this.viewModel);
        };
        return PresentationRequest;
    })();

    var MvvmPresenter = (function () {
        function MvvmPresenter(settings) {
            this.settings = settings;
            this.presentationChanged = "presentationChanged";
            this.baseDir = settings.origin;
            this.viewLoader = new Presenting.ViewLoader(settings.viewLoaderSettings);
            this.viewModelLoader = new Presenting.ViewModelLoader(settings.viewModelLoaderSettings, settings.viewModelInstanceCreator);
            this.frame = settings.frame;
            this.bindingTarget = settings.bindingTarget || this.frame;
        }
        MvvmPresenter.prototype.show = function (target, parameter, callback) {
            var _this = this;
            var request = new PresentationRequest(target, parameter, this.viewLoader, this.viewModelLoader, function (v, vm) {
                _this.frame.innerHTML = v;
                _this.initDataDefers(_this.frame);
                _this.initDataContexts(_this.frame);
                ko.cleanNode(_this.bindingTarget);
                ko.applyBindings(vm, _this.bindingTarget);
                if (callback)
                    callback();
            });
        };

        MvvmPresenter.prototype.initDataDefers = function (htmlElement, parameter) {
            var dataDefers = NodeHelper.getAllElementsWithAttribute(htmlElement, "data-defer");

            if (dataDefers) {
                for (var i = 0; i < dataDefers.length; i++) {
                    var el = dataDefers[i].element;
                    var deferTarget = dataDefers[i].target;
                    var s = $.extend(false, {}, this.settings);
                    s.frame = el;
                    var presenter = new MvvmPresenter(s);
                    presenter.show(deferTarget, parameter);
                }
            }
        };

        MvvmPresenter.prototype.initDataContexts = function (htmlElement, parameter) {
            var _this = this;
            var withDataContext = NodeHelper.getAllElementsWithAttribute(htmlElement, "data-context");

            if (withDataContext) {
                withDataContext.forEach(function (o) {
                    var el = o.element;
                    var vmName = o.target;
                    _this.viewModelLoader.load(vmName, function (vm) {
                        vm.init(parameter);
                        ko.applyBindings(vm, el);
                    });
                });
            }
        };
        return MvvmPresenter;
    })();
    Presenting.MvvmPresenter = MvvmPresenter;

    var MainPresenter = (function (_super) {
        __extends(MainPresenter, _super);
        function MainPresenter(settings, context) {
            var _this = this;
            _super.call(this, settings);
            this.context = context;
            this.initDataDefers(context);
            this.initDataContexts(context);
            this.routing = new Presenting.Routing();

            $(this.routing).on(Presenting.Routing.routeParsed, function (event) {
                var params = [];
                for (var _i = 0; _i < (arguments.length - 1); _i++) {
                    params[_i] = arguments[_i + 1];
                }
                console.log('route parsed', params);
                _this.show(params[0], null);
            });
            this.routing.addRoute("{section}");
        }
        MainPresenter.prototype.show = function (target, parameter, callback) {
            if (this.currentTarget != target || !this.currentTarget) {
                this.currentTarget = target;
                _super.prototype.show.call(this, target, parameter, callback);
            }
        };
        return MainPresenter;
    })(MvvmPresenter);
    Presenting.MainPresenter = MainPresenter;

    var ModalPresenter = (function (_super) {
        __extends(ModalPresenter, _super);
        function ModalPresenter(modal, settings, routing) {
            var _this = this;
            _super.call(this, settings);
            this.modal = modal;
            this.settings.frame = modal.frame;
            routing.goBackRequested.add(function (s) {
                console.log("modalpresenter.routing.gobackrequsted", _this.isopen);
                if (_this.isopen)
                    _this.modal.hide();
            });
            this.modal.statechanged.add(function (p) {
                console.log("modalpresenter.modal.statechanged", p.isopen);
                _this.isopen = p.isopen;
                if (!p.isopen)
                    routing.goback();
            });
        }
        ModalPresenter.prototype.show = function (target, parameter, callback) {
            this.modal.show();
            _super.prototype.show.call(this, target, parameter, callback);
        };
        return ModalPresenter;
    })(MvvmPresenter);
    Presenting.ModalPresenter = ModalPresenter;
})(Presenting || (Presenting = {}));
//# sourceMappingURL=presenter.js.map

///#source 1 1 /Presenting/modal.js
/// <reference path="../events/event.ts" />
/// <reference path="presenter.ts" />
var Presenting;
(function (Presenting) {
    var ModalStateChangedEventArgs = (function () {
        function ModalStateChangedEventArgs(isopen) {
            this.isopen = isopen;
        }
        return ModalStateChangedEventArgs;
    })();
    Presenting.ModalStateChangedEventArgs = ModalStateChangedEventArgs;
})(Presenting || (Presenting = {}));
//# sourceMappingURL=modal.js.map

///#source 1 1 /Presenting/presenting.js
/// <reference path="presenter.ts" />
var Presenting;
(function (Presenting) {
    var PresentingStatic = (function () {
        function PresentingStatic() {
        }
        PresentingStatic.prototype.create = function (settings) {
            settings.viewLoaderSettings = settings.viewLoaderSettings || this.mainSettings.viewLoaderSettings;
            settings.viewModelLoaderSettings = settings.viewModelLoaderSettings || this.mainSettings.viewModelLoaderSettings;

            var presenter = new Presenting.MvvmPresenter(settings);

            return presenter;
        };

        PresentingStatic.prototype.initMain = function (settings, context) {
            console.log(Presenting);
            this.mainSettings = settings;
            console.log("init main mainPresenter", settings, Presenting.MainPresenter);
            var presenter = new Presenting.MainPresenter(settings, context);
            return presenter;
        };
        return PresentingStatic;
    })();
    Presenting.PresentingStatic = PresentingStatic;
})(Presenting || (Presenting = {}));

presenting = new Presenting.PresentingStatic();
//# sourceMappingURL=presenting.js.map


