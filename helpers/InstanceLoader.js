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
