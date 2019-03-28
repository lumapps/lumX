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
                activable: '=?lxActivable',
                border: '=?lxBorder',
                bulk: '=?lxBulk',
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
        lxDataTable.bulk = angular.isUndefined(lxDataTable.bulk) ? true : lxDataTable.bulk;
        lxDataTable.sort = sort;
        lxDataTable.toggleActivation = toggleActivation;
        lxDataTable.toggleAllSelected = toggleAllSelected;
        lxDataTable.toggleSelection = toggleSelection;

        lxDataTable.$sce = $sce;
        lxDataTable.allRowsSelected = false;
        lxDataTable.selectedRows = [];

        $scope.$on('lx-data-table__select', function(event, id, row)
        {
            if (id === lxDataTable.id && angular.isDefined(row))
            {
                _select((angular.isArray(row) && row.length > 0) ? row[0] : row);
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
                _unselect((angular.isArray(row) && row.length > 0) ? row[0] : row);
            }
        });

        $scope.$on('lx-data-table__unselect-all', function(event, id)
        {
            if (id === lxDataTable.id)
            {
                _unselectAll();
            }
        });

        $scope.$on('lx-data-table__activate', function(event, id, row)
        {
            if (id === lxDataTable.id && angular.isDefined(row))
            {
                _activate((angular.isArray(row) && row.length > 0) ? row[0] : row);
            }
        });

        $scope.$on('lx-data-table__deactivate', function(event, id, row)
        {
            if (id === lxDataTable.id && angular.isDefined(row))
            {
                _deactivate((angular.isArray(row) && row.length > 0) ? row[0] : row);
            }
        });

        ////////////

        function _activate(row)
        {
            toggleActivation(row, true);
        }

        function _deactivate(row)
        {
            toggleActivation(row, false);
        }

        function _select(row)
        {
            toggleSelection(row, true);
        }

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

        function _unselect(row)
        {
            toggleSelection(row, false);
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

        function toggleActivation(_row, _newActivatedStatus)
        {
            if (_row.lxDataTableDisabled || !lxDataTable.activable)
            {
                return;
            }

            for (var i = 0, len = lxDataTable.tbody.length; i < len; i++)
            {
                if (lxDataTable.tbody.indexOf(_row) !== i)
                {
                    lxDataTable.tbody[i].lxDataTableActivated = false;
                }
            }

            _row.lxDataTableActivated = !_row.lxDataTableActivated;

            if (_row.lxDataTableActivated)
            {
                $rootScope.$broadcast('lx-data-table__activated', lxDataTable.id, _row);
            }
            else
            {
                $rootScope.$broadcast('lx-data-table__deactivated', lxDataTable.id, _row);
            }
        }

        function toggleAllSelected()
        {
            if (!lxDataTable.bulk)
            {
                return;
            }

            if (lxDataTable.allRowsSelected)
            {
                _unselectAll();
            }
            else
            {
                _selectAll();
            }
        }

        function toggleSelection(_row, _newSelectedStatus, _event)
        {
            if (_row.lxDataTableDisabled || !lxDataTable.selectable)
            {
                return;
            }

            if (angular.isDefined(_event)) {
                _event.stopPropagation();
            }

            _row.lxDataTableSelected = angular.isDefined(_newSelectedStatus) ? _newSelectedStatus : !_row.lxDataTableSelected;

            if (_row.lxDataTableSelected)
            {
                // Make sure it's not already in.
                if (lxDataTable.selectedRows.length === 0 || (lxDataTable.selectedRows.length && lxDataTable.selectedRows.indexOf(_row) === -1))
                {
                    lxDataTable.selectedRows.push(_row);
                    lxDataTable.areAllRowsSelected();

                    $rootScope.$broadcast('lx-data-table__selected', lxDataTable.id, lxDataTable.selectedRows, _row);
                }
            }
            else
            {
                if (lxDataTable.selectedRows.length && lxDataTable.selectedRows.indexOf(_row) > -1)
                {
                    lxDataTable.selectedRows.splice(lxDataTable.selectedRows.indexOf(_row), 1);
                    lxDataTable.allRowsSelected = false;

                    $rootScope.$broadcast('lx-data-table__unselected', lxDataTable.id, lxDataTable.selectedRows, _row);
                }
            }
        }
    }
})();
