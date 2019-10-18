import template from '../views/data-table.html';

/////////////////////////////

function DataTableController($rootScope, $sce, $scope) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether all rows are selected or not.
     *
     * @type {boolean}
     */
    lx.allRowsSelected = false;

    /**
     * The list of selected rows.
     *
     * @type {Array}
     */
    lx.selectedRows = [];

    /////////////////////////////

    /**
     * Services and utilities.
     */
    lx.$sce = $sce;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Select a given row.
     *
     * @param {Object} row The row to select.
     */
    function _select(row) {
        lx.toggleSelection(row, true);
    }

    /**
     * Select all rows.
     */
    function _selectAll() {
        lx.selectedRows.length = 0;

        for (let i = 0, len = lx.tbody.length; i < len; i++) {
            if (!lx.tbody[i].lxDataTableDisabled) {
                lx.tbody[i].lxDataTableSelected = true;
                lx.selectedRows.push(lx.tbody[i]);
            }
        }

        lx.allRowsSelected = true;

        $rootScope.$broadcast('lx-data-table__unselected', lx.dataTableId, lx.selectedRows);
    }

    /**
     * Unselect a given row.
     *
     * @param {Object} row The row to unselect.
     */
    function _unselect(row) {
        lx.toggleSelection(row, false);
    }

    /**
     * Unselect all rows.
     */
    function _unselectAll() {
        for (let i = 0, len = lx.tbody.length; i < len; i++) {
            if (!lx.tbody[i].lxDataTableDisabled) {
                lx.tbody[i].lxDataTableSelected = false;
            }
        }

        lx.allRowsSelected = false;
        lx.selectedRows.length = 0;

        $rootScope.$broadcast('lx-data-table__selected', lx.dataTableId, lx.selectedRows);
    }

    /**
     * Update all rows selected boolean according to displayed rows.
     */
    function _setAllRowsSelected() {
        let displayedRows = 0;

        for (let i = 0, len = lx.tbody.length; i < len; i++) {
            if (!lx.tbody[i].lxDataTableDisabled) {
                displayedRows++;
            }
        }

        if (displayedRows === lx.selectedRows.length) {
            lx.allRowsSelected = true;
        } else {
            lx.allRowsSelected = false;
        }
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Sort a given column.
     *
     * @param {Object} column The column to sort.
     */
    function sort(column) {
        if (!column.isSortable) {
            return;
        }

        for (let i = 0, len = lx.thead.length; i < len; i++) {
            if (lx.thead[i].isSortable && lx.thead[i].name !== column.name) {
                lx.thead[i].sortOrder = undefined;
            }
        }

        if (!column.sortOrder || column.sortOrder === 'desc') {
            column.sortOrder = 'asc';
        } else {
            column.sortOrder = 'desc';
        }

        $rootScope.$broadcast('lx-data-table__sorted', lx.dataTableId, column);
    }

    /**
     * Select or unselect all rows.
     */
    function toggleAllSelected() {
        if (!lx.hasBulk) {
            return;
        }

        if (lx.allRowsSelected) {
            _unselectAll();
        } else {
            _selectAll();
        }
    }

    /**
     * Toggle a geiven row selection.
     *
     * @param {Object} row       The row to select/unselect.
     * @param {Object} newStatus The new status to apply.
     */
    function toggleSelection(row, newStatus) {
        if (row.lxDataTableDisabled || !lx.isClickable) {
            return;
        }

        row.lxDataTableSelected = angular.isDefined(newStatus) ? newStatus : !row.lxDataTableSelected;

        if (row.lxDataTableSelected) {
            if (lx.selectedRows.length === 0 || (lx.selectedRows.length > 0 && lx.selectedRows.indexOf(row) === -1)) {
                lx.selectedRows.push(row);
                _setAllRowsSelected();

                $rootScope.$broadcast('lx-data-table__selected', lx.dataTableId, lx.selectedRows, row);
            }
        } else if (lx.selectedRows.length > 0 && lx.selectedRows.indexOf(row) > -1) {
            lx.selectedRows.splice(lx.selectedRows.indexOf(row), 1);
            lx.allRowsSelected = false;

            $rootScope.$broadcast('lx-data-table__unselected', lx.dataTableId, lx.selectedRows, row);
        }
    }

    /////////////////////////////

    lx.sort = sort;
    lx.toggleAllSelected = toggleAllSelected;
    lx.toggleSelection = toggleSelection;

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * Select a given row.
     *
     * @param {Event}  evt         The select event.
     * @param {string} dataTableId The data table identifier.
     * @param {Object} row         The row to select.
     */
    $scope.$on('lx-data-table__select', (evt, dataTableId, row) => {
        if (dataTableId === lx.dataTableId && angular.isDefined(row)) {
            _select(angular.isArray(row) && row.length > 0 ? row[0] : row);
        }
    });

    /**
     * Select all rows.
     *
     * @param {Event}  evt         The select event.
     * @param {string} dataTableId The data table identifier.
     */
    $scope.$on('lx-data-table__select-all', (evt, dataTableId) => {
        if (dataTableId === lx.dataTableId) {
            _selectAll();
        }
    });

    /**
     * Unselect a given row.
     *
     * @param {Event}  evt         The select event.
     * @param {string} dataTableId The data table identifier.
     * @param {Object} row         The row to unselect.
     */
    $scope.$on('lx-data-table__unselect', (evt, dataTableId, row) => {
        if (dataTableId === lx.dataTableId && angular.isDefined(row)) {
            _unselect(angular.isArray(row) && row.length > 0 ? row[0] : row);
        }
    });

    /**
     * Unselect all rows.
     *
     * @param {Event}  evt         The select event.
     * @param {string} dataTableId The data table identifier.
     */
    $scope.$on('lx-data-table__unselect-all', (evt, dataTableId) => {
        if (dataTableId === lx.dataTableId) {
            _unselectAll();
        }
    });
}

/////////////////////////////

function DataTableDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl) {
        attrs.$observe('id', (dataTableId) => {
            ctrl.dataTableId = dataTableId;
        });
    }

    return {
        bindToController: true,
        controller: DataTableController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            hasBulk: '=?lxHasBulk',
            hasDividers: '=?lxHasDividers',
            isClickable: '=?lxIsClickable',
            tbody: '=lxTbody',
            thead: '=lxThead',
            theme: '@?lxTheme',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.data-table').directive('lxDataTable', DataTableDirective);

/////////////////////////////

export { DataTableDirective };
