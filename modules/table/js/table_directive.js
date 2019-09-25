import template from '../views/table.html';

/////////////////////////////

function TableController() {
    'ngInject';

    // eslint-disable-next-line consistent-this, no-unused-vars
    const lx = this;
}

/////////////////////////////

function TableDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: TableController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            hasBefore: '=?lxHasBefore',
            hasDividers: '=?lxHasDividers',
            isClickable: '=?lxIsClickable',
            theme: '@?lxTheme',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.table').directive('lxTable', TableDirective);

/////////////////////////////

export { TableDirective };
