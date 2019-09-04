import template from '../views/side-navigation.html';

/////////////////////////////

function SideNavigationDirective() {
    'ngInject';

    return {
        replace: true,
        restrict: 'E',
        scope: {},
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.side-navigation').directive('lxSideNavigation', SideNavigationDirective);

/////////////////////////////

export { SideNavigationDirective };
