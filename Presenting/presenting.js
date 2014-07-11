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
