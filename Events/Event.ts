module Events {
    export interface IEvent<T> {
        add(listener: (parameter: T) => any, priority?: number): void;
        remove(listener: (parameter: T) => any): void;
        dispatch(parameter: T): boolean;
        clear(): void;
        hasListeners(): boolean;
    }

    export class Event<T> implements IEvent<T> {
        private listeners: { (parameter: T): any }[] = [];
        private priorities: number[] = [];

        add(listener: (parameter: T) => any, priority = 0): void {
            var index = this.listeners.indexOf(listener);
            if (index !== -1) {
                this.priorities[index] = priority;
                return;
            }
            for (var i = 0, l = this.priorities.length; i < l; i++) {
                if (this.priorities[i] < priority) {
                    this.priorities.splice(i, 0, priority);
                    this.listeners.splice(i, 0, listener);
                    return;
                }
            }
            this.priorities.push(priority);
            this.listeners.push(listener);
        }

        remove(listener: (parameter: T) => any): void {
            var index = this.listeners.indexOf(listener);
            if (index >= 0) {
                this.priorities.splice(index, 1);
                this.listeners.splice(index, 1);
            }
        }

        dispatch(parameter: T): boolean {
            var indexesToRemove: number[];
            var hasBeenCanceled = this.listeners.every((listener: (parameter: T) => any) => {
                var result = listener(parameter);
                return result !== false;
            });

            return hasBeenCanceled;
        }

        clear(): void {
            this.listeners = [];
            this.priorities = [];
        }

        hasListeners(): boolean {
            return this.listeners.length > 0;
        }
    }
}
