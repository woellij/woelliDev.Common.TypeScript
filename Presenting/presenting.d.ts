/// <reference path="../helpers/instanceloader.ts" />
/// <reference path="../events/event.ts" />

declare module Presenting {
    import IEvent = Events.IEvent;

    export interface IViewModel {
        init(parameter: any): void;
    }

    export interface IPresenterSettings {
        frame: HTMLElement;
        viewModelInstanceCreator: Helpers.InstanceLoader;
        bindingTarget?: HTMLElement;
        viewLoaderSettings?: ILoaderSettings;
        viewModelLoaderSettings?: ILoaderSettings;
        origin?: string;
    }

    export interface ILoaderSettings {
        rootDir: string;
        targetDir: string;
        mappings: Object;
        extension: string;
        fileNameEnding: string;
    }

    export interface IPresenter {
        show(target: string, parameter: any, callback?: Function);
    }

    export interface IRouting {
        addRoute(path: string, callback?: Function);
        goback(): void;
        goBackRequested: IEvent<string>;
    }

    export interface IMainPresenter extends IPresenter {
        routing: IRouting;
    }

    export interface IPresenting {
        create(settings: IPresenterSettings): IPresenter;
        initMain(settings: IPresenterSettings, context: HTMLElement): IMainPresenter;
    }
}

declare var presenting: Presenting.IPresenting;