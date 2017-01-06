(function()
{
    'use strict';

    angular
        .module('lumx.data-table')
        .service('LxDataTableService', LxDataTableService);

    LxDataTableService.$inject = ['$rootScope'];

    function LxDataTableService($rootScope)
    {
        var service = this;

        service.selectAll = selectAll;
        service.selectRow = selectRow;
        service.unselectAll = unselectAll;
        service.unselectRow = unselectRow;

        ////////////

        function selectAll(_dataTableId)
        {
            $rootScope.$broadcast('lx-data-table__select-all', _dataTableId);
        }

        function selectRow(_dataTableId, row)
        {
            $rootScope.$broadcast('lx-data-table__select-row', _dataTableId, row);
        }

        function unselectAll(_dataTableId)
        {
            $rootScope.$broadcast('lx-data-table__unselect-all', _dataTableId);
        }

        function unselectRow(_dataTableId, row)
        {
            $rootScope.$broadcast('lx-data-table__unselect-row', _dataTableId, row);
        }
    }
})();