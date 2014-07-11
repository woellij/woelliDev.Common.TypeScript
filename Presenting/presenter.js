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
