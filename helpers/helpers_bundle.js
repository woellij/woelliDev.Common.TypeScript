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

