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
//# sourceMappingURL=Signal.js.map
