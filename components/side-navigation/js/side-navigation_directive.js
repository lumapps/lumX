import template from '../views/side-navigation.html';

/////////////////////////////

function SideNavigationController() {
    'ngInject';

    // eslint-disable-next-line consistent-this, no-unused-vars
    const lx = this;
}

/////////////////////////////

function SideNavigationDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: SideNavigationController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            customColors: '=?lxCustomColors',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.side-navigation').directive('lxSideNavigation', SideNavigationDirective);

/////////////////////////////

export { SideNavigationDirective };
