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

        service.select = select;
        service.selectAll = selectAll;
        service.unselect = unselect;
        service.unselectAll = unselectAll;
        service.activate = activate;
        service.deactivate = deactivate;

        ////////////

        function select(_dataTableId, row)
        {
            $rootScope.$broadcast('lx-data-table__select', _dataTableId, row);
        }

        function selectAll(_dataTableId)
        {
            $rootScope.$broadcast('lx-data-table__select-all', _dataTableId);
        }

        function unselect(_dataTableId, row)
        {
            $rootScope.$broadcast('lx-data-table__unselect', _dataTableId, row);
        }

        function unselectAll(_dataTableId)
        {
            $rootScope.$broadcast('lx-data-table__unselect-all', _dataTableId);
        }

        function activate(_dataTableId, row)
        {
            $rootScope.$broadcast('lx-data-table__activate', _dataTableId, row);
        }

        function deactivate(_dataTableId, row)
        {
            $rootScope.$broadcast('lx-data-table__deactivate', _dataTableId, row);
        }
    }
})();
