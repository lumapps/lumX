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
                border: '=?lxBorder',
                selectable: '=?lxSelectable',
                thumbnail: '=?lxThumbnail',
                tbody: '=lxTbody',
                thead: '=lxThead'
            },
            link: link,
            controller: LxDataTableController,
            controllerAs: 'lxDataTable',
            bindToController: true,
            transclude: true,
            replace: true
        };

        function link(scope, element, attrs, ctrl)
        {
            attrs.$observe('id', function(_newId)
            {
                ctrl.id = _newId;
            });
        }
    }

    LxDataTableController.$inject = ['$rootScope', '$sce', '$scope'];

    function LxDataTableController($rootScope, $sce, $scope)
    {
        var lxDataTable = this;

        lxDataTable.areAllRowsSelected = areAllRowsSelected;
        lxDataTable.border = angular.isUndefined(lxDataTable.border) ? true : lxDataTable.border;
        lxDataTable.sort = sort;
        lxDataTable.toggle = toggle;
        lxDataTable.toggleAllSelected = toggleAllSelected;

        lxDataTable.$sce = $sce;
        lxDataTable.allRowsSelected = false;
        lxDataTable.selectedRows = [];

        $scope.$on('lx-data-table__select-all', function(event, id)
        {
            if (id === lxDataTable.id)
            {
                _selectAll();
            }
        });

        $scope.$on('lx-data-table__unselect-all', function(event, id)
        {
            if (id === lxDataTable.id)
            {
                _unselectAll();
            }
        });

        ////////////

        function _selectAll()
        {
            lxDataTable.selectedRows.length = 0;

            for (var i = 0, len = lxDataTable.tbody.length; i < len; i++)
            {
                if (!lxDataTable.tbody[i].lxDataTableDisabled)
                {
                    lxDataTable.tbody[i].lxDataTableSelected = true;
                    lxDataTable.selectedRows.push(lxDataTable.tbody[i]);
                }
            }

            lxDataTable.allRowsSelected = true;

            $rootScope.$broadcast('lx-data-table__unselect', lxDataTable.selectedRows);
        }

        function _unselectAll()
        {
            for (var i = 0, len = lxDataTable.tbody.length; i < len; i++)
            {
                if (!lxDataTable.tbody[i].lxDataTableDisabled)
                {
                    lxDataTable.tbody[i].lxDataTableSelected = false;
                }
            }

            lxDataTable.allRowsSelected = false;
            lxDataTable.selectedRows.length = 0;

            $rootScope.$broadcast('lx-data-table__select', lxDataTable.selectedRows);
        }

        ////////////

        function areAllRowsSelected()
        {
            var displayedRows = 0;

            for (var i = 0, len = lxDataTable.tbody.length; i < len; i++)
            {
                if (!lxDataTable.tbody[i].lxDataTableDisabled)
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

        function sort(_column)
        {
            if (!_column.sortable)
            {
                return;
            }

            for (var i = 0, len = lxDataTable.thead.length; i < len; i++)
            {
                if (lxDataTable.thead[i].sortable && lxDataTable.thead[i].name !== _column.name)
                {
                    lxDataTable.thead[i].sort = undefined;
                }
            }

            if (!_column.sort || _column.sort === 'desc')
            {
                _column.sort = 'asc';
            }
            else
            {
                _column.sort = 'desc';
            }

            $rootScope.$broadcast('lx-data-table__sort', _column);
        }

        function toggle(_row)
        {
            if (_row.lxDataTableDisabled || !lxDataTable.selectable)
            {
                return;
            }

            _row.lxDataTableSelected = !_row.lxDataTableSelected;

            if (_row.lxDataTableSelected)
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
            if (lxDataTable.allRowsSelected)
            {
                _unselectAll();
            }
            else
            {
                _selectAll();
            }
        }
    }
})();