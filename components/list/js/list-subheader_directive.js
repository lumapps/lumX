import { CSS_PREFIX } from '@lumx/core/js/constants';

/////////////////////////////

function ListSubheaderDirective() {
    'ngInject';

    return {
        replace: true,
        restrict: 'E',
        template: `<li class="${CSS_PREFIX}-list-subheader" ng-transclude></li>`,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.list').directive('lxListSubheader', ListSubheaderDirective);

/////////////////////////////

export { ListSubheaderDirective };
