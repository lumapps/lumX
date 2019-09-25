import { mdiArrowDown, mdiArrowUp } from '@lumx/icons';

import template from '../views/table-cell-head.html';

/////////////////////////////

function TableCellHeadController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The table icons.
     *
     * @type {Object}
     */
    lx.icons = {
        mdiArrowDown,
        mdiArrowUp,
    };
}

/////////////////////////////

function TableCellHeadDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: TableCellHeadController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            icon: '@?lxIcon',
            isSortable: '=?lxIsSortable',
            scope: '@?lxScope',
            sortOrder: '@?lxSortOrder',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.table').directive('lxTableCellHead', TableCellHeadDirective);

/////////////////////////////

export { TableCellHeadDirective };
