
module Presenting {
    import InstanceLoader = Helpers.InstanceLoader;

    export class Loader {
        cache: Object;
        settings: ILoaderSettings;

        constructor(settings: ILoaderSettings) {
            this.cache = {};
            this.settings = settings;
        }

        public load(target: string, callback: Function) {
            target = this.resolveTarget(target);
            if (this.cache[target]) {
                callback(this.cache[target]);
            } else {
                var filename = this.createFileName(target);
                $.ajax(filename)
                    .done((result) => {
                        this.cache[target] = result;
                        callback(result);
                    })
                    .fail((xhr, options, r) => {
                        console.error("failed to load", target, filename, xhr, options, r);
                        if (target !== "404")
                            this.load("404", callback);
                    });
            }
        }

        private createFileName(target: string) {
            var file = this.settings.rootDir + "/"
                + this.settings.targetDir + "/"
                + target
                + this.settings.fileNameEnding
                + this.settings.extension;
            return file;
        }

        private resolveTarget(target: string) {
            var t = this.settings.mappings[target];
            if (t)
                return t;
            return target;
        }
    }

    export class ViewLoader extends Loader {

        constructor(settings: ILoaderSettings) {
            super(settings);
        }
    }

    export class ViewModelLoader extends Loader {
        constructor(settings: ILoaderSettings, private instanceLoader: InstanceLoader) {
            super(settings);
        }

        public load(target: string, callback: Function) {
            super.load(target, (js) => {
                var first = target.charAt(0).toUpperCase();
                var viewModelname = first + target.substr(1) + "ViewModel";
                var vm = this.instanceLoader.getInstance(viewModelname);
                callback(vm);
            });
        }
    }
}