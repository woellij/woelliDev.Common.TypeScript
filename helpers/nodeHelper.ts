module Helpers {
    export class NodeHelper {
        public static getAllElementsWithAttribute(parent: HTMLElement, attribute: string) {
            var matchingElements = [];
            var allElements = parent.getElementsByTagName('*');
            for (var i = 0, n = allElements.length; i < n; i++) {
                var el = allElements[i];
                var defer = el.attributes.getNamedItem(attribute);
                if (defer) {
                    matchingElements.push({ element: el, target: defer.value });
                }
            }
            return matchingElements;
        }
    }
} 