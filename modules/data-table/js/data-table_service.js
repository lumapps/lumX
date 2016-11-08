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
        service.unselectAll = unselectAll;

        ////////////

        function selectAll(_dataTableId)
        {
            $rootScope.$broadcast('lx-data-table__select-all', _dataTableId);
        }

        function unselectAll(_dataTableId)
        {
            $rootScope.$broadcast('lx-data-table__unselect-all', _dataTableId);
        }
    }
})();