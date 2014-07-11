var Helpers;
(function (Helpers) {
    var NodeHelper = (function () {
        function NodeHelper() {
        }
        NodeHelper.getAllElementsWithAttribute = function (parent, attribute) {
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
        };
        return NodeHelper;
    })();
    Helpers.NodeHelper = NodeHelper;
})(Helpers || (Helpers = {}));
//# sourceMappingURL=nodeHelper.js.map
