import { CSS_PREFIX } from '@lumx/core/js/constants';

/////////////////////////////

function ListDividerDirective() {
    'ngInject';

    return {
        replace: true,
        restrict: 'E',
        template: `<li class="${CSS_PREFIX}-list-divider"></li>`,
    };
}

/////////////////////////////

angular.module('lumx.list').directive('lxListDivider', ListDividerDirective);

/////////////////////////////

export { ListDividerDirective };
