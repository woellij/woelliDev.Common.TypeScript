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
