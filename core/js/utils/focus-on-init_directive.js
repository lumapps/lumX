function FocusOnInitDirective($timeout) {
    'ngInject';

    function link(scope, el, attrs) {
        if (angular.isDefined(attrs.lxFocusOnInit) && attrs.lxFocusOnInit && !scope.$eval(attrs.lxFocusOnInit)) {
            return;
        }

        $timeout(() => {
            el.focus();
        });
    }

    return {
        link,
    };
}

/////////////////////////////

angular.module('lumx.utils.focus-on-init').directive('lxFocusOnInit', FocusOnInitDirective);

/////////////////////////////

export { FocusOnInitDirective };
