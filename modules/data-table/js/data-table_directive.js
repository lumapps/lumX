(function()
{
    'use strict';

    angular
        .module('lumx.data-table')
        .directive('lxDataTable', lxDataTable)
        .directive('lxDataTableThead', lxDataTableThead)
        .directive('lxDataTableTbody', lxDataTableTbody);

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

    function LxDataTableController()
    {
        var lxDataTable = this;

        lxDataTable.areAllRowsSelected = areAllRowsSelected;

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
    }

    function lxDataTableThead()
    {
        return {
            restrict: 'E',
            require: ['^lxDataTable', '^lxDataTableThead'],
            templateUrl: 'data-table-thead.html',
            link: link,
            controller: LxDataTableTheadController,
            controllerAs: 'lxDataTableThead',
            bindToController: true,
            transclude: true,
            replace: true
        };

        function link(scope, element, attrs, ctrls)
        {
            ctrls[1].setParentController(ctrls[0]);
        }
    }

    LxDataTableTbodyController.$inject = ['$rootScope'];

    function LxDataTableTheadController($rootScope)
    {
        var lxDataTableThead = this;

        lxDataTableThead.setParentController = setParentController;
        lxDataTableThead.toggleAllSelected = toggleAllSelected;

        ////////////

        function setParentController(_parentCtrl)
        {
            lxDataTableThead.parentCtrl = _parentCtrl;
        }

        function toggleAllSelected()
        {
            for (var i = 0, len = lxDataTableThead.parentCtrl.tbody.length; i < len; i++)
            {
                if (!lxDataTableThead.parentCtrl.tbody[i].disabled)
                {
                    if (lxDataTableThead.parentCtrl.allRowsSelected)
                    {
                        lxDataTableThead.parentCtrl.tbody[i].selected = false;
                    }
                    else
                    {
                        lxDataTableThead.parentCtrl.tbody[i].selected = true;
                        lxDataTableThead.parentCtrl.selectedRows.push(lxDataTableThead.parentCtrl.tbody[i]);
                    }
                }
            }

            if (lxDataTableThead.parentCtrl.allRowsSelected)
            {
                lxDataTableThead.parentCtrl.allRowsSelected = false;
                lxDataTableThead.parentCtrl.selectedRows.length = 0;

                $rootScope.$broadcast('data-table__select', lxDataTableThead.parentCtrl.selectedRows);
            }
            else
            {
                lxDataTableThead.parentCtrl.allRowsSelected = true;

                $rootScope.$broadcast('data-table__unselect', lxDataTableThead.parentCtrl.selectedRows);
            }
        }
    }

    function lxDataTableTbody()
    {
        return {
            restrict: 'E',
            require: ['^lxDataTable', '^lxDataTableTbody'],
            templateUrl: 'data-table-tbody.html',
            link: link,
            controller: LxDataTableTbodyController,
            controllerAs: 'lxDataTableTbody',
            bindToController: true,
            transclude: true,
            replace: true
        };

        function link(scope, element, attrs, ctrls)
        {
            ctrls[1].setParentController(ctrls[0]);
        }
    }

    LxDataTableTbodyController.$inject = ['$rootScope'];

    function LxDataTableTbodyController($rootScope)
    {
        var lxDataTableTbody = this;

        lxDataTableTbody.setParentController = setParentController;
        lxDataTableTbody.toggle = toggle;

        ////////////

        function setParentController(_parentCtrl)
        {
            lxDataTableTbody.parentCtrl = _parentCtrl;
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
                lxDataTableTbody.parentCtrl.selectedRows.push(_row);
                lxDataTableTbody.parentCtrl.areAllRowsSelected();

                $rootScope.$broadcast('data-table__select', lxDataTableTbody.parentCtrl.selectedRows);
            }
            else
            {
                if (lxDataTableTbody.parentCtrl.selectedRows.length)
                {
                    lxDataTableTbody.parentCtrl.selectedRows.splice(lxDataTableTbody.parentCtrl.selectedRows.indexOf(_row), 1);
                }

                lxDataTableTbody.parentCtrl.allRowsSelected = false;

                $rootScope.$broadcast('data-table__unselect', lxDataTableTbody.parentCtrl.selectedRows);
            }
        }
    }
})();