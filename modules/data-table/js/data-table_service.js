function LxDataTableService($rootScope) {
    'ngInject';

    const service = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Select a given row.
     *
     * @param {string} dataTableId The data table identifier.
     * @param {Object} row         The row to select.
     */
    function select(dataTableId, row) {
        $rootScope.$broadcast('lx-data-table__select', dataTableId, row);
    }

    /**
     * Select all rows.
     *
     * @param {string} dataTableId The data table identifier.
     */
    function selectAll(dataTableId) {
        $rootScope.$broadcast('lx-data-table__select-all', dataTableId);
    }

    /**
     * Unselect a given row.
     *
     * @param {string} dataTableId The data table identifier.
     * @param {Object} row         The row to unselect.
     */
    function unselect(dataTableId, row) {
        $rootScope.$broadcast('lx-data-table__unselect', dataTableId, row);
    }

    /**
     * Unselect all rows.
     *
     * @param {string} dataTableId The data table identifier.
     */
    function unselectAll(dataTableId) {
        $rootScope.$broadcast('lx-data-table__unselect-all', dataTableId);
    }

    /////////////////////////////

    service.select = select;
    service.selectAll = selectAll;
    service.unselect = unselect;
    service.unselectAll = unselectAll;
}

/////////////////////////////

angular.module('lumx.data-table').service('LxDataTableService', LxDataTableService);

/////////////////////////////

export { LxDataTableService };
