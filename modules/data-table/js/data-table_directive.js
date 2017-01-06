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

        $scope.$on('lx-data-table__select', function(event, id, row)
        {
            if (id === lxDataTable.id && angular.isDefined(row))
            {
                if (angular.isArray(row) && row.length > 0)
                {
                    row = row[0];
                }
                _select(row);
            }
        });

        $scope.$on('lx-data-table__select-all', function(event, id)
        {
            if (id === lxDataTable.id)
            {
                _selectAll();
            }
        });

        $scope.$on('lx-data-table__unselect', function(event, id, row)
        {
            if (id === lxDataTable.id && angular.isDefined(row))
            {
                if (angular.isArray(row) && row.length > 0)
                {
                    row = row[0];
                }
                _unselect(row);
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

            $rootScope.$broadcast('lx-data-table__unselected', lxDataTable.id, lxDataTable.selectedRows);
        }

        function _select(row)
        {
            toggle(row, true);
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

            $rootScope.$broadcast('lx-data-table__selected', lxDataTable.id, lxDataTable.selectedRows);
        }

        function _unselect(row)
        {
            toggle(row, false);
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

            $rootScope.$broadcast('lx-data-table__sorted', lxDataTable.id, _column);
        }

        function toggle(_row, _newSelectedStatus)
        {
            if (_row.lxDataTableDisabled || !lxDataTable.selectable)
            {
                return;
            }

            _row.lxDataTableSelected = angular.isDefined(_newSelectedStatus) ? _newSelectedStatus : !_row.lxDataTableSelected;

            if (_row.lxDataTableSelected)
            {
                // Make sure it's not already in.
                if (lxDataTable.selectedRows.length === 0 || (lxDataTable.selectedRows.length && lxDataTable.selectedRows.indexOf(_row) === -1))
                {
                    lxDataTable.selectedRows.push(_row);
                    lxDataTable.areAllRowsSelected();

                    $rootScope.$broadcast('lx-data-table__selected', lxDataTable.id, lxDataTable.selectedRows);
                }
            }
            else
            {
                if (lxDataTable.selectedRows.length && lxDataTable.selectedRows.indexOf(_row) > -1)
                {
                    lxDataTable.selectedRows.splice(lxDataTable.selectedRows.indexOf(_row), 1);
                    lxDataTable.allRowsSelected = false;

                    $rootScope.$broadcast('lx-data-table__unselected', lxDataTable.id, lxDataTable.selectedRows);
                }
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