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
