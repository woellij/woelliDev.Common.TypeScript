/// <reference path="../helpers/nodehelper.ts" />
/// <reference path="loader.ts" />
/// <reference path="../events/event.ts" />
/// <reference path="../js-signals.d.ts" />
/// <reference path="modal.ts" />
/// <reference path="routing.ts" />
/// <reference path="presenting.d.ts" />
module Presenting {
    import NodeHelper = Helpers.NodeHelper;

    class PresentationRequest {
        viewModel: IViewModel;
        view: any;
        callback: Function;

        constructor(target: string, parameter: any, viewLoader: Loader, viewModelLoader: Loader, callback: Function) {
            this.callback = callback;
            viewLoader.load(target, (v) => {
                this.view = v;
                this.loaderFinished();
            });
            viewModelLoader.load(target, (vm) => {
                this.viewModel = vm;
                (<IViewModel>vm).init(parameter);
                this.loaderFinished();
            });
        }

        loaderFinished() {
            if (this.view && this.viewModel)
                this.callback(this.view, this.viewModel);
        }
    }

    export class MvvmPresenter implements IPresenter {
        private viewLoader: ViewLoader;
        private viewModelLoader: ViewModelLoader;
        private baseDir;
        private frame: HTMLElement;
        private bindingTarget: HTMLElement;
        presentationChanged: string = "presentationChanged";

        constructor(public settings: IPresenterSettings) {
            this.baseDir = settings.origin;
            this.viewLoader = new ViewLoader(settings.viewLoaderSettings);
            this.viewModelLoader = new ViewModelLoader(settings.viewModelLoaderSettings, settings.viewModelInstanceCreator);
            this.frame = settings.frame;
            this.bindingTarget = settings.bindingTarget || this.frame;
        }

        public show(target: string, parameter: any, callback?: Function) {
            var request = new PresentationRequest(target,
                parameter,
                this.viewLoader,
                this.viewModelLoader,
                (v, vm) => {
                    this.frame.innerHTML = v;
                    this.initDataDefers(this.frame);
                    this.initDataContexts(this.frame);
                    ko.cleanNode(this.bindingTarget);
                    ko.applyBindings(vm, this.bindingTarget);
                    if (callback)
                        callback();
                });
        }

        public initDataDefers(htmlElement: HTMLElement, parameter?: any) {
            var dataDefers = NodeHelper.getAllElementsWithAttribute(htmlElement, "data-defer");

            if (dataDefers) {
                for (var i = 0; i < dataDefers.length; i++) {
                    var el = dataDefers[i].element;
                    var deferTarget = dataDefers[i].target;
                    var s = <IPresenterSettings>$.extend(false, {}, this.settings);
                    s.frame = el;
                    var presenter = new MvvmPresenter(s);
                    presenter.show(deferTarget, parameter);
                }
            }
        }

        public initDataContexts(htmlElement: HTMLElement, parameter?: any) {
            var withDataContext = NodeHelper.getAllElementsWithAttribute(htmlElement, "data-context");

            if (withDataContext) {
                withDataContext.forEach(o => {
                    var el = o.element;
                    var vmName = o.target;
                    this.viewModelLoader.load(vmName, vm => {
                        (<IViewModel>vm).init(parameter);
                        ko.applyBindings(vm, el);
                    });
                });
            }
        }
    }

    export class MainPresenter extends MvvmPresenter implements IMainPresenter {
        public routing: IRouting;
        private currentTarget: string;

        constructor(settings: IPresenterSettings, private context: HTMLElement) {
            super(settings);
            this.initDataDefers(context);
            this.initDataContexts(context);
            this.routing = new Routing();

            $(this.routing).on(Routing.routeParsed,
                (event, ...params) => {
                    console.log('route parsed', params);
                    this.show(params[0], null);
                });
            this.routing.addRoute("{section}");
        }

        public show(target: string, parameter: any, callback?: Function) {
            if (this.currentTarget != target || !this.currentTarget) {
                this.currentTarget = target;
                super.show(target, parameter, callback);
            }
        }
    }

    export class ModalPresenter extends MvvmPresenter implements IModalPresenter {
        private isopen: boolean;

        constructor(private modal: IModal, settings: IPresenterSettings, routing: IRouting) {
            super(settings);
            this.settings.frame = modal.frame;
            routing.goBackRequested.add((s) => {
                console.log("modalpresenter.routing.gobackrequsted", this.isopen);
                if (this.isopen)
                    this.modal.hide();
            });
            this.modal.statechanged.add((p) => {
                console.log("modalpresenter.modal.statechanged", p.isopen);
                this.isopen = p.isopen;
                if (!p.isopen)
                    routing.goback();
            });
        }

        public show(target: string, parameter: any, callback?: Function) {
            this.modal.show();
            super.show(target, parameter, callback);
        }
    }
}