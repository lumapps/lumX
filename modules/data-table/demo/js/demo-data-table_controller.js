(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoDataTableController', DemoDataTableController);

    DemoDataTableController.$inject = ['$filter', '$scope'];

    function DemoDataTableController($filter, $scope)
    {
        var vm = this;

        vm.dataTableThead = [
        {
            id: 1,
            name: 'dessert',
            label: 'Dessert',
            sortable: true
        },
        {
            id: 2,
            name: 'calories',
            label: 'Calories',
            sortable: true
        },
        {
            id: 3,
            name: 'fat',
            label: 'Fat (g)',
            sortable: true,
            sort: 'asc'
        },
        {
            id: 4,
            name: 'comments',
            label: 'Comments',
            icon: 'comment-text',
            sortable: false
        }];
        vm.dataTableTbody = [
        {
            id: 1,
            dessert: 'Frozen yogurt',
            calories: 159,
            fat: 6.0,
            comments: 'Lorem ipsum'
        },
        {
            id: 2,
            dessert: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            comments: 'Lorem ipsum',
            lxDataTableDisabled: true
        },
        {
            id: 3,
            dessert: 'Eclair',
            calories: 262,
            fat: 16.0,
            comments: 'Lorem ipsum'
        }];

        $scope.$on('lx-data-table__select', updateActions);
        $scope.$on('lx-data-table__unselect', updateActions);
        $scope.$on('lx-data-table__sort', updateSort);

        ////////////

        function updateActions(_event, _selectedRows)
        {
            vm.selectedRows = _selectedRows;
        }

        function updateSort(_event, _column)
        {
            vm.dataTableTbody = $filter('orderBy')(vm.dataTableTbody, _column.name, _column.sort === 'desc' ? true : false);
        }
    }
})();