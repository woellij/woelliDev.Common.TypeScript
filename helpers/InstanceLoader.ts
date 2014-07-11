module Helpers {
    export class InstanceLoader {
        subcontexts: string[];

        constructor(private context: Object, ...subContexts: string[]) {
            this.subcontexts = subContexts;
        }

        getInstance(name: string, ...args: any[]) {
            var classContext: any = this.context;
            if (this.subcontexts)
                for (var i = 0; i < this.subcontexts.length; i++) {
                    var pathPart = this.subcontexts[i];
                    classContext = classContext[pathPart];
                }
            var instance = Object.create(classContext[name].prototype);
            instance.constructor.apply(instance, args);
            return instance;
        }

    }
}