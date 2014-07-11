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
