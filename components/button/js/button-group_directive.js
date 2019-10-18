import { CSS_PREFIX } from '@lumx/core/js/constants';

/////////////////////////////

function ButtonGroupDirective() {
    'ngInject';

    return {
        replace: true,
        restrict: 'E',
        template: `<div class="${CSS_PREFIX}-button-group" ng-transclude></div>`,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.button').directive('lxButtonGroup', ButtonGroupDirective);

/////////////////////////////

export { ButtonGroupDirective };
