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
            name: 'dessert',
            label: 'Dessert',
            sortable: true
        },
        {
            name: 'calories',
            label: 'Calories',
            sortable: true
        },
        {
            name: 'fat',
            label: 'Fat (g)',
            sortable: true,
            sort: 'asc'
        },
        {
            name: 'comments',
            label: 'Comments',
            icon: 'comment-text',
            sortable: false
        }];
        vm.advancedDataTableThead = angular.copy(vm.dataTableThead);
        vm.advancedDataTableThead.unshift(
        {
            name: 'image',
            format: function(row)
            {
                return '<img src="' + row.image + '" width="40" height="40" class="img-round">';
            }
        });
        vm.dataTableTbody = [
        {
            id: 1,
            image: '/images/placeholder/1-square.jpg',
            dessert: 'Frozen yogurt',
            calories: 159,
            fat: 6.0,
            comments: 'Lorem ipsum'
        },
        {
            id: 2,
            image: '/images/placeholder/2-square.jpg',
            dessert: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            comments: 'Lorem ipsum',
            lxDataTableDisabled: true
        },
        {
            id: 3,
            image: '/images/placeholder/3-square.jpg',
            dessert: 'Eclair',
            calories: 262,
            fat: 16.0,
            comments: 'Lorem ipsum'
        }];

        $scope.$on('lx-data-table__selected', updateActions);
        $scope.$on('lx-data-table__unselected', updateActions);
        $scope.$on('lx-data-table__sorted', updateSort);

        ////////////

        function updateActions(_event, _dataTableId, _selectedRows)
        {
            if (_dataTableId === 'lolo') {
                vm.selectedRows = _selectedRows;
            }
        }

        function updateSort(_event, _dataTableId, _column)
        {
            vm.dataTableTbody = $filter('orderBy')(vm.dataTableTbody, _column.name, _column.sort === 'desc' ? true : false);
        }
    }
})();