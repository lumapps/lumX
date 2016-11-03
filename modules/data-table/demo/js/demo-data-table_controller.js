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
        },
        {
            name: 'image',
            label: 'Image',
            sortable: false,
            format: function(row)
            {
                return '<img src="' + row.image + '" width="40" height="40" class="img-round">';
            }
        }];
        vm.dataTableTbody = [
        {
            id: 1,
            dessert: 'Frozen yogurt',
            calories: 159,
            fat: 6.0,
            comments: 'Lorem ipsum',
            image: '/images/placeholder/1-square.jpg'
        },
        {
            id: 2,
            dessert: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            comments: 'Lorem ipsum',
            image: '/images/placeholder/2-square.jpg',
            lxDataTableDisabled: true
        },
        {
            id: 3,
            dessert: 'Eclair',
            calories: 262,
            fat: 16.0,
            comments: 'Lorem ipsum',
            image: '/images/placeholder/3-square.jpg'
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