import { mdiCommentOutline, mdiDotsVertical, mdiInformationOutline } from '@lumx/icons';

/////////////////////////////

function DemoTableController($filter) {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether all rows are selected or not.
     *
     * @type {boolean}
     */
    vm.allSelected = false;

    /**
     * The actions icons.
     *
     * @type {boolean}
     */
    vm.icons = {
        mdiDotsVertical,
        mdiInformationOutline,
    };

    /**
     * The body of the table.
     * This represents the data to display in the table.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    vm.tableBody = [
        {
            // eslint-disable-next-line no-magic-numbers
            calories: 159,
            comments: 'Lorem ipsum',
            dessert: 'Frozen yogurt',
            // eslint-disable-next-line no-magic-numbers
            fat: 6.0,
            id: 1,
        },
        {
            // eslint-disable-next-line no-magic-numbers
            calories: 237,
            comments: 'Lorem ipsum',
            dessert: 'Ice cream sandwich',
            // eslint-disable-next-line no-magic-numbers
            fat: 9.0,
            // eslint-disable-next-line no-magic-numbers
            id: 2,
        },
        {
            // eslint-disable-next-line no-magic-numbers
            calories: 262,
            comments: 'Lorem ipsum',
            dessert: 'Eclair',
            // eslint-disable-next-line no-magic-numbers
            fat: 16.0,
            // eslint-disable-next-line no-magic-numbers
            id: 3,
        },
    ];

    /**
     * The head of the table.
     * This represents the cells of the table.
     *
     * @type {Array}
     * @constant
     * @readonly
     */
    vm.tableHead = [
        {
            isSortable: true,
            label: 'Dessert',
            name: 'dessert',
        },
        {
            isSortable: true,
            label: 'Calories',
            name: 'calories',
            width: '100',
        },
        {
            isSortable: true,
            label: 'Fat (g)',
            name: 'fat',
            sortOrder: 'asc',
            width: '100',
        },
        {
            icon: mdiCommentOutline,
            isSortable: false,
            label: 'Comments',
            name: 'comments',
            width: '150',
        },
    ];

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Select a row in the table.
     *
     * @param {Object} rowToSelect The row to select.
     */
    function selectRow(rowToSelect) {
        rowToSelect.isSelected = !rowToSelect.isSelected;
    }

    /**
     * Update the sorting of the table.
     *
     * @param {Object} cellToSort The cell to sort the table by.
     */
    function updateSort(cellToSort) {
        if (!cellToSort.isSortable) {
            return;
        }

        angular.forEach(vm.tableHead, (cell) => {
            if (cell !== cellToSort) {
                cell.sortOrder = undefined;
            }
        });

        if (cellToSort.sortOrder === 'asc') {
            cellToSort.sortOrder = 'desc';
        } else {
            cellToSort.sortOrder = 'asc';
        }

        vm.tableBody = $filter('orderBy')(vm.tableBody, cellToSort.name, cellToSort.sortOrder === 'desc');
    }

    /////////////////////////////

    vm.selectRow = selectRow;
    vm.updateSort = updateSort;
}

/////////////////////////////

angular.module('lumx-demo').controller('DemoTableController', DemoTableController);

/////////////////////////////

export { DemoTableController };
