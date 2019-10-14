import template from '../views/progress.html';

/////////////////////////////

function ProgressController() {
    'ngInject';

    // eslint-disable-next-line consistent-this, no-unused-vars
    const lx = this;
}

/////////////////////////////

function ProgressDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: ProgressController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            customColors: '=?lxCustomColors',
            variant: '@?lxVariant',
        },
        template,
    };
}

/////////////////////////////

angular.module('lumx.progress').directive('lxProgress', ProgressDirective);

/////////////////////////////

export { ProgressDirective };
