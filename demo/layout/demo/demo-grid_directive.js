import template from './demo-grid.html';

/////////////////////////////

function DemoGridDirective() {
    'ngInject';

    return {
        replace: true,
        restrict: 'E',
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx-demo').directive('demoGrid', DemoGridDirective);

/////////////////////////////

export { DemoGridDirective };
