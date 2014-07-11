/// <reference path="../events/event.ts" />
/// <reference path="presenter.ts" />
module Presenting {

    import IEvent = Events.IEvent;

    export interface IModalPresenter extends IPresenter {

    }

    export class ModalStateChangedEventArgs {
        constructor(public isopen: boolean){}
    }

    export interface IModal {
        show(): void;
        hide(): void;
        frame: HTMLElement;
        statechanged: IEvent<ModalStateChangedEventArgs>;
    }
}