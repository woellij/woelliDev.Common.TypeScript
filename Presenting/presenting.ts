/// <reference path="presenter.ts" />

module Presenting {
    export class PresentingStatic implements IPresenting {
        mainSettings: IPresenterSettings;

        create(settings: IPresenterSettings): IPresenter {
            settings.viewLoaderSettings = settings.viewLoaderSettings || this.mainSettings.viewLoaderSettings;
            settings.viewModelLoaderSettings = settings.viewModelLoaderSettings || this.mainSettings.viewModelLoaderSettings;

            var presenter = new MvvmPresenter(settings);

            return presenter;
        }

        initMain(settings: IPresenterSettings, context: HTMLElement): IMainPresenter {
            console.log(Presenting);
            this.mainSettings = settings;
            console.log("init main mainPresenter", settings, MainPresenter);
            var presenter = new MainPresenter(settings, context);
            return presenter;
        }
    }
}

presenting = new Presenting.PresentingStatic();
