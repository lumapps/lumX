import { CSS_PREFIX } from '@lumx/core/js/constants';

/////////////////////////////

function RadioGroupDirective() {
    'ngInject';

    return {
        replace: true,
        restrict: 'E',
        template: `<div class="${CSS_PREFIX}-radio-group" ng-transclude></div>`,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.radio-button').directive('lxRadioGroup', RadioGroupDirective);

/////////////////////////////

export { RadioGroupDirective };
