/// <reference path="presenter.ts" />
var Presenting;
(function (_Presenting) {
    var Presenting = (function () {
        function Presenting() {
        }
        Presenting.prototype.create = function (settings) {
            settings.viewLoaderSettings = settings.viewLoaderSettings || this.mainSettings.viewLoaderSettings;
            settings.viewModelLoaderSettings = settings.viewModelLoaderSettings || this.mainSettings.viewModelLoaderSettings;

            var presenter = new _Presenting.MvvmPresenter(settings);

            return presenter;
        };

        Presenting.prototype.initMain = function (settings) {
            this.mainSettings = settings;
            console.log("init main presenter", settings, _Presenting.MainPresenter);
            var presenter = new _Presenting.MainPresenter(settings);
            return presenter;
        };
        return Presenting;
    })();
    _Presenting.Presenting = Presenting;
})(Presenting || (Presenting = {}));

presenting = new Presenting.Presenting();
//# sourceMappingURL=presentation.js.map
