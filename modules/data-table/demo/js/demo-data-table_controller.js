(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoDataTableController', DemoDataTableController);

    DemoDataTableController.$inject = ['$scope'];

    function DemoDataTableController($scope)
    {
        var vm = this;

        vm.dataTableThead = [
        {
            name: 'Dessert',
            sortable: true
        },
        {
            name: 'Calories',
            sortable: true
        },
        {
            name: 'Fat (g)',
            sortable: true,
            sort: 'asc'
        },
        {
            name: 'Comments',
            icon: 'comment-text',
            sortable: false
        }];
        vm.dataTableTbody = [
        {
            id: 1,
            td: [
            {
                name: 'Frozen yogurt'
            },
            {
                name: '159'
            },
            {
                name: '6.0'
            },
            {
                name: 'Lorem ipsum'
            }]
        },
        {
            id: 2,
            disabled: true,
            td: [
            {
                name: 'Ice cream sandwich'
            },
            {
                name: '237'
            },
            {
                name: '9.0'
            },
            {
                name: 'Lorem ipsum'
            }]
        },
        {
            id: 3,
            td: [
            {
                name: 'Eclair'
            },
            {
                name: '262'
            },
            {
                name: '16.0'
            },
            {
                name: 'Lorem ipsum'
            }]
        }];
        vm.dataTableParams = {
            selectedCount: 0
        };

        $scope.$on('data-table__select', updateActions);
        $scope.$on('data-table__unselect', updateActions);

        ////////////

        function updateActions(_event, _selectedRows)
        {
            vm.selectedRows = _selectedRows;
        }
    }
})();