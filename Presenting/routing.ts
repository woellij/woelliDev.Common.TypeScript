/// <reference path="../history.d.ts" />
/// <reference path="../crossroads.d.ts" />
/// <reference path="../history.d.ts" />
/// <reference path="../events/event.ts" />

module Presenting {
    import IEvent = Events.IEvent;
    import Event = Events.Event;

    export class Routing implements IRouting {
        static routeParsed: string = "routeParsed";
        private historyjs: Historyjs = <any>History;
        private routes: { [index: string]: Function; } = {};
        private parameter;
        goBackRequested: IEvent<string>;

        constructor() {
            this.historyjs.Adapter.bind(window, 'statechange', () => this.onHashChange());
            this.goBackRequested = new Event<String>();
            this.onHashChange();
        }

        addRoute(path: string, callback?: Function) {
            console.log("Adding Route", path);
            var route = crossroads.addRoute(path, (...params) => {
                if (callback)
                    callback(params);
                else
                    $(this).trigger(Routing.routeParsed, params);
            });
        }

        parse(url: string) {
            console.log("parsing", url);
            crossroads.parse(url);
        }
        goback(): void {
            this.historyjs.back();
        }
        private hashBackStack: Array<string> = new Array<string>();

        onHashChange(): void {
            var state = this.historyjs.getState();
            this.parameter = state.data;



            console.log("History STATE", state);

            if (state.hash) {
                var hash = <string>state.hash.replace(".", "");
                hash = hash.replace("//", "/");
                hash = hash.replace("#", "");

                if (this.hashBackStack.length > 1) {
                    var previoushash = this.hashBackStack[this.hashBackStack.length - 2];
                    if (previoushash == hash) {
                        console.log("routing gone back");
                        this.hashBackStack.pop();
                        this.hashBackStack.pop();
                        this.goBackRequested.dispatch(hash);
                    }
                } else {
                }

                this.hashBackStack.push(hash);
                console.log(this.hashBackStack);
                this.parse(hash);
            } else {
                console.error("History state has no hash");
            }
        }
    }
}