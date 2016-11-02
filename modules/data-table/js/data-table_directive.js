(function()
{
    'use strict';

    angular
        .module('lumx.data-table')
        .directive('lxDataTable', lxDataTable);

    function lxDataTable()
    {
        return {
            restrict: 'E',
            templateUrl: 'data-table.html',
            scope:
            {
                selectable: '=?lxSelectable',
                tbody: '=lxTbody',
                thead: '=lxThead'
            },
            controller: LxDataTableController,
            controllerAs: 'lxDataTable',
            bindToController: true,
            transclude: true,
            replace: true
        };
    }

    LxDataTableController.$inject = ['$rootScope'];

    function LxDataTableController($rootScope)
    {
        var lxDataTable = this;

        lxDataTable.areAllRowsSelected = areAllRowsSelected;
        lxDataTable.toggle = toggle;
        lxDataTable.toggleAllSelected = toggleAllSelected;

        lxDataTable.allRowsSelected = false;
        lxDataTable.selectedRows = [];

        ////////////

        function areAllRowsSelected()
        {
            var displayedRows = 0;

            for (var i = 0, len = lxDataTable.tbody.length; i < len; i++)
            {
                if (!lxDataTable.tbody[i].disabled)
                {
                    displayedRows++;
                }
            }

            if (displayedRows === lxDataTable.selectedRows.length)
            {
                lxDataTable.allRowsSelected = true;
            }
            else
            {
                lxDataTable.allRowsSelected = false;
            }
        }

        function toggle(_row)
        {
            if (_row.disabled)
            {
                return;
            }

            _row.selected = !_row.selected;

            if (_row.selected)
            {
                lxDataTable.selectedRows.push(_row);
                lxDataTable.areAllRowsSelected();

                $rootScope.$broadcast('lx-data-table__select', lxDataTable.selectedRows);
            }
            else
            {
                if (lxDataTable.selectedRows.length)
                {
                    lxDataTable.selectedRows.splice(lxDataTable.selectedRows.indexOf(_row), 1);
                }

                lxDataTable.allRowsSelected = false;

                $rootScope.$broadcast('lx-data-table__unselect', lxDataTable.selectedRows);
            }
        }

        function toggleAllSelected()
        {
            if (!lxDataTable.allRowsSelected)
            {
                lxDataTable.selectedRows.length = 0;
            }

            for (var i = 0, len = lxDataTable.tbody.length; i < len; i++)
            {
                if (!lxDataTable.tbody[i].disabled)
                {
                    if (lxDataTable.allRowsSelected)
                    {
                        lxDataTable.tbody[i].selected = false;
                    }
                    else
                    {
                        lxDataTable.tbody[i].selected = true;
                        lxDataTable.selectedRows.push(lxDataTable.tbody[i]);
                    }
                }
            }

            if (lxDataTable.allRowsSelected)
            {
                lxDataTable.allRowsSelected = false;
                lxDataTable.selectedRows.length = 0;

                $rootScope.$broadcast('lx-data-table__select', lxDataTable.selectedRows);
            }
            else
            {
                lxDataTable.allRowsSelected = true;

                $rootScope.$broadcast('lx-data-table__unselect', lxDataTable.selectedRows);
            }
        }
    }
})();