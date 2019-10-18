import template from '../views/table-cell-body.html';

/////////////////////////////

function TableCellBodyDirective() {
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

angular.module('lumx.table').directive('lxTableCellBody', TableCellBodyDirective);

/////////////////////////////

export { TableCellBodyDirective };
