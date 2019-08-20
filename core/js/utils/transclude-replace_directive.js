function TranscludeReplaceDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl, transclude) {
        if (!transclude) {
            return;
        }

        transclude((clone) => {
            if (clone.length > 0) {
                el.replaceWith(clone);
            } else {
                el.remove();
            }
        });
    }

    return {
        link,
        restrict: 'EA',
        terminal: true,
    };
}

/////////////////////////////

angular.module('lumx.utils.transclude-replace').directive('ngTranscludeReplace', TranscludeReplaceDirective);

/////////////////////////////

export { TranscludeReplaceDirective };
